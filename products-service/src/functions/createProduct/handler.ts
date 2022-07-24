import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse, formatJSONResponseSpecificCode} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import schema from './schema';
import {ProductService} from "../../services/product.service";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event.body);
  // @ts-ignore
  const {title, description, price, count} = event.body;
  console.log(title, description, price, count)
  try {
    await ProductService.createProduct({title, description, price, count})
    return formatJSONResponse({
      products: []
    });
  } catch (e) {
    formatJSONResponseSpecificCode(404, {products: []})
  }
};

export const main = middyfy(createProduct);
