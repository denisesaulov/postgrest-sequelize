import {getDbConfig} from "../configs/dbConfig"
import {Sequelize} from "sequelize"

const {database, dbUser, dbPass, dbOptions} = getDbConfig()
export const sequelize = new Sequelize(database, dbUser, dbPass, dbOptions)
