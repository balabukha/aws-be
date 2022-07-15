import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse, formatJSONResponseSpecificCode} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import productsJSON from '../stubs/productList.json'
import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('===> ', event);
  try {
    const {id} = event.pathParameters
    return formatJSONResponse({
      product: productsJSON.filter(product => product.id === id)
    });
  } catch (e) {
    return formatJSONResponseSpecificCode(404, {});
  }
};

export const main = middyfy(getProductsById);
