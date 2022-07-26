import {DB_CONFIG} from "./dbConfig";
import {Client} from "pg";
import {ICount, IProduct} from "../types/product";

export class ProductService {
  private static connection: any;

  private static async connectToToDb() {
    if (!Boolean(this.connection)) {
      this.connection = new Client(DB_CONFIG);
      await this.connection.connect();
    }
  }

  private static async closeDbConnection() {
    if (Boolean(this.connection)) {
      await this.connection.end();
      this.connection = null;
    }
  }

  static async getAllProductsAndStocks(): Promise<(IProduct & ICount)[]> {
    await this.connectToToDb();
    const {rows} = await this.connection.query(
      `SELECT p.*, s.count
       from products AS p
                INNER JOIN stocks AS s ON s.product_id = p.id`);
    await this.closeDbConnection();
    return rows;
  }

  static async getProductById(id): Promise<(IProduct & ICount)[]> {
    await this.connectToToDb();
    const {rows} = await this.connection.query(
      `SELECT id, title, description, price, "count"
       FROM stocks s
                left join products p on p.id = s.product_id
       WHERE p.id = '${id}'`);
    await this.closeDbConnection();
    return rows;
  }

  static async createProduct({title, description, price, count}): Promise<void> {
    await this.connectToToDb();
    try {
      await this.connection.query(
        `DO
$$
    DECLARE
        my_uuid uuid = uuid_generate_v4();
    BEGIN
        INSERT INTO products (id, title, description, price)
        VALUES (my_uuid, '${title}', '${description}', ${price});
        INSERT INTO stocks ("product_id", count)
        VALUES (my_uuid, ${count});
    END;
$$
language plpgsql;`
      );
    } catch (e) {
      console.log('error ', e)
    }

    await this.closeDbConnection();
  }
}
