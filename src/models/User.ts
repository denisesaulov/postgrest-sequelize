import {Model} from "sequelize"

export class User extends Model {
  declare id: number
  declare balance: number
}


