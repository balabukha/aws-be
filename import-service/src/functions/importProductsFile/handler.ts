import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('event', event);
  const {fileName} = event.pathParameters
  console.log('fileName', fileName);

  try {
    const params = {
      region: "eu-west-1",
    };
    const {fileName} = event.pathParameters
    const client = new AWS.S3(params);
    const url = await client.getSignedUrlPromise("putObject", {
      Bucket: "awsimportservice",
      Key: `uploaded/${fileName}`,
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
