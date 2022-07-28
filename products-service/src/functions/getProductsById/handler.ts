import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse, formatJSONResponseSpecificCode} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import schema from './schema';
import {ProductService} from "../../services/product.service";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const {id} = event.pathParameters

    const rows = await ProductService.getProductById(id)
    return formatJSONResponse({
      products: rows
    });
  } catch (e) {
    formatJSONResponseSpecificCode(500, {})
  }
};

export const main = middyfy(getProductsById);
