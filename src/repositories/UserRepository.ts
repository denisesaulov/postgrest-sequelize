import {DataTypes, Sequelize, Transaction} from "sequelize"
import {User} from "../models/User"
import {UserNotEnoughBalanceError, UserNotFoundError, UserUpdateError} from "../errors"
import ISOLATION_LEVELS = Transaction.ISOLATION_LEVELS


export interface IUserRepository {
  seedUser(balance: number): Promise<User>

  checkDbConnection(): Promise<void>

  reduceBalance(userId: number, amount: number): Promise<void>

  getUser(userId: number): Promise<User>

  sync(): Promise<void>
}

export class UserRepository implements IUserRepository {
  constructor(private readonly db: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      balance: {
        type: DataTypes.INTEGER

      }
    }, {sequelize: db, tableName: "Users"})
  }

  public async checkDbConnection(): Promise<void> {
    await this.db.authenticate()
  }

  public async seedUser(balance: number): Promise<User> {
    return new User({balance}).save()
  }

  public async reduceBalance(userId: number, amount: number): Promise<void> {
    const transaction: Transaction = await this.db.transaction({isolationLevel:ISOLATION_LEVELS.READ_COMMITTED})
    const user = await User.findByPk<User>(userId,{transaction,lock:transaction.LOCK.UPDATE})

    if (user && user.balance >= amount) {
      try {
        // user.balance = user.balance - amount
        await user.update({balance: user.balance - amount},{transaction})
        await transaction.commit()
      } catch
        (e) {
        await transaction.rollback()
        throw new UserUpdateError("something went wrong")
      }
    } else {
      await transaction.rollback()
    }
    if (!user) {
      throw new UserNotFoundError(userId)
    }
    if (user && user.balance <= amount) {
      throw new UserNotEnoughBalanceError(user.id, user.balance)
    }
  }

  public async getUser(userId: number): Promise<User> {
    const user = await User.findOne({where: {id: userId}})
    if (!user) {
      throw new UserNotFoundError(userId)
    }
    return user
  }

  public async sync(): Promise<void> {
    await User.sync({force: true})
  }
}