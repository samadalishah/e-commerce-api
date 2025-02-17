import { HttpException, HttpStatus } from '@nestjs/common';

export class UserException extends HttpException {
  private constructor(message: string, httpStatus: HttpStatus) {
    super(message, httpStatus);
  }

  public static userNotFound(username: string): UserException {
    return new UserException(`User with username ${username} not found`, HttpStatus.NOT_FOUND)
  }

  public static userAlreadyExists(username: string): UserException {
    return new UserException(`User with username ${username} already exists`, HttpStatus.CONFLICT)
  }
}
