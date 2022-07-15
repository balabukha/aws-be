import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse, formatJSONResponseSpecificCode} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import products from '../stubs/productList.json'
import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    if (products) {
      return formatJSONResponse({
        products: products
      });
    }
  } catch (e) {
    formatJSONResponseSpecificCode(404, {products: []})
  }
};

export const main = middyfy(getProductsList);
