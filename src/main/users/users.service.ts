import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import User from '../domain/user/user.entity'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find()
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepo.create(userData)
    return this.userRepo.save(user)
  }
}
