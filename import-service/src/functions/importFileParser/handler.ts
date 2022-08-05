import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import AWS from 'aws-sdk';
import parse from 'csv-parser';
import schema from './schema';
import {formatJSONResponse} from "@libs/api-gateway";

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event: any) => {
  try {
    console.log(event);
    const params = {
      region: "eu-west-1",
    };
    const BUCKET = event.Records[0].s3.bucket.name;
    const client = new AWS.S3(params);
    let result: Array<any> = [];
    let statusCode: number | null = null

    if (!event.Records.length) return formatJSONResponse({}, 500);

    for (const record of event.Records) {

      let key = record.s3.object.key,
        param = {Bucket: BUCKET, Key: key};

      client.getObject(param).createReadStream()
        .pipe(parse())
        .on('data', (line) => {
          console.log(line);
          result.push(line)
        })
        .on('error', (error) => {
          console.log(error);
          statusCode = 500;
          result = null;
        })
        .on('end', () => {
          statusCode = 200;
          console.log('Completed')
        })

      const copyParams = {
        Bucket: BUCKET,
        CopySource: `${BUCKET}/${record.s3.object.key}`,
        Key: record.s3.object.key.replace('uploaded', 'parsed')
      };

      const DeleteParams = {
        Bucket: BUCKET,
        Key: record.s3.object.key,
      };

      await client.copyObject(copyParams).promise();
      await client.deleteObject(DeleteParams).promise();
    }

    formatJSONResponse({}, statusCode);

  } catch (e) {
    return formatJSONResponse(e, 500);
  }

};

export const main = middyfy(importFileParser);
