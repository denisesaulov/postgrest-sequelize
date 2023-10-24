import express, {Response, Request, Express, NextFunction, ErrorRequestHandler} from 'express'
import {UserRepository} from "./repositories/UserRepository"
import {ApiParamsError} from "./errors"

const app: Express = express()

export default function (port: Number, userRepo: UserRepository): void {

  app.patch('/:userId/:amount', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {userId, amount} = req.params
      if (!userId || !amount || isNaN(parseFloat(amount)) || isNaN(parseFloat(userId))) {
        return next(new ApiParamsError(userId || "bad userId"))
      }
      await userRepo.reduceBalance(+userId, +amount)
      res.status(204).send("OK")
    } catch (e: any) {
      next(e)
    }
  })

  app.get('/user/:userId', async (req: Request, res: Response, next) => {
    const {userId} = req.params
    try{
    if (!userId || isNaN(parseFloat(userId))) {
      return next(new ApiParamsError(userId || "null"))
    }
    const user = await userRepo.getUser(+userId)
    res.status(200).json(user)

    } catch (e){
      next(e)
    }
  })

  app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    res.status(err.status || 500).json({error: err.message, code: err.code || ""})
  })

  app.listen(port, () => {
    console.log(`server started on ${port}`)
  })
}
