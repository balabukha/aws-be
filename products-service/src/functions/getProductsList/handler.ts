import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {formatJSONResponse, formatJSONResponseSpecificCode} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import schema from './schema';
import {ProductService} from "../../services/product.service";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const rows = await ProductService.getAllProductsAndStocks()
    return formatJSONResponse({
      products: rows
    });
  } catch (e) {
    formatJSONResponseSpecificCode(404, {products: []})
  }
};

export const main = middyfy(getProductsList);
