import {ClientConfig} from "pg";

export const DB_CONFIG: ClientConfig = {
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
}
