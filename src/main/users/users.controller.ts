import { Controller, Param, Query, Get, Post, Delete, Body } from '@nestjs/common'
import { IsString, IsEmail, MinLength } from 'class-validator';
import { UsersService } from './users.service'
import User from '../domain/user/user.entity'
import Validate from '../support/validate.body'

class UserRequest {
  @IsString()
  username: string

  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Get()
  async getUser(@Query('username') username: string): Promise<User> {
    return this.usersService.get(username)
  }

  @Post()
  async createUser(@Validate(UserRequest) @Body() userData: Partial<UserRequest>): Promise<number> {
    const user = this.convert(userData as UserRequest)
    return this.usersService.create(user)
  }

  @Post('/update')
  async updateUser(@Validate(UserRequest) @Body() userData: Partial<UserRequest>): Promise<User> {
    const user = this.convert(userData as UserRequest)
    return this.usersService.update(user)
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(parseInt(id))
  }

  private convert(userData: UserRequest): User {
    const user = new User()
    user.username = userData.username
    user.name = userData.name
    user.email = userData.email
    user.password = userData.password

    return user
  }
}
