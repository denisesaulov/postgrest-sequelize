import {Dialect, Options} from "sequelize"

export interface IDbConfig{
  database: string,
  dbUser: string,
  dbPass: string,
  dbOptions: Options
}

export function getDbConfig(): IDbConfig {
  return {
    database: process.env["DB_NAME"] || "",
    dbUser: process.env["DB_USER"] || "",
    dbPass: process.env["DB_PASSWORD"] || "",
    dbOptions: {
      host: process.env["DB_HOST"] || "",
      dialect: "postgres",
      logging: false
    }
  }
}