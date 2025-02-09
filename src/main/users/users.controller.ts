import { Controller, Get, Post, Body } from '@nestjs/common'
import { UsersService } from './users.service'
import User from '../domain/user/user.entity'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Post()
  async createUser(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData)
  }
}
