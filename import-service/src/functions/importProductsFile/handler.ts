import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import AWS from 'aws-sdk';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const params = {
      region: "eu-west-1",
    };
    const {name} = event.queryStringParameters
    const client = new AWS.S3(params);
    const url = await client.getSignedUrlPromise("putObject", {
      Bucket: "awsimportservice",
      Body: 'hello',
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    });

    return formatJSONResponse(url, 200);
  } catch (err) {
    console.log(err);
    return formatJSONResponse(err, 500);
  }
};

export const main = middyfy(importProductsFile);
