import { Client } from "pg";

export const client = new Client({
  user: process.env.DB_USER,
  database: process.env.DB_SPACE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});
