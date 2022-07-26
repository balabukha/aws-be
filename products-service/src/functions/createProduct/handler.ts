import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse, formatJSONResponseSpecificCode} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import schema from './schema';
import {ProductService} from "../../services/product.service";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(event.body);
  // @ts-ignore
  const {title, description, price, count} = event.body;
  if (!Boolean(title) || !Boolean(description) || !Boolean(price) || !Boolean(count)) {
    formatJSONResponseSpecificCode(400, {})
  } else {
    try {
      await ProductService.createProduct({title, description, price, count})
      return formatJSONResponse({});
    } catch (e) {
      formatJSONResponseSpecificCode(500, {})
    }
  }
};

export const main = middyfy(createProduct);
