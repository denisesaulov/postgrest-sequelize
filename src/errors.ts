
export class UserUpdateError extends Error {
  public readonly code = "user-update/error"
  public readonly status = 500

  constructor(message: string) {
    super(message)
  }
}

export class UserNotFoundError extends Error {
  public readonly code = "user-update/not-found"
  public readonly status = 404

  constructor(userId: number) {
    super(`User with id ${userId} not found`)
  }
}

export class UserNotEnoughBalanceError extends Error {
  public readonly code = "user-update/not-enough-balance"
  public readonly status = 409

  constructor(userId: number, balance: number) {
    super(`User with id: ${userId} have low balance ${balance}`)
  }
}

export class ApiParamsError extends Error {
  public readonly code = "bad-request"
  public readonly status = 400
  constructor(userId: string) {
    super(`bad request: userId ${userId}`)
  }
}

