import dotEnv from "dotenv"
dotEnv.config()
import {UserRepository} from "./repositories/UserRepository"
import {sequelize} from "./repositories/dbConnection"
import startApi from "./api"

const port: Number = Number(process.env.PORT) || 3000
const userRepo: UserRepository = new UserRepository(sequelize)

run()

async function run(): Promise<void> {
  await userRepo.checkDbConnection()
  await userRepo.sync()
  await userRepo.seedUser(10000)
  startApi(port, userRepo)
}


