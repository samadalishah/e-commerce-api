import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import User from '../domain/user/user.entity'
import { UserException } from '../domain/user/user.exception';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find()
  }

  async create(u: User): Promise<number> {
    const existingUser = await this.userRepo.findOneBy({username: u.username}) as User
    if (existingUser) {
      throw UserException.userAlreadyExists(u.username)
    }

    const user = this.userRepo.create(u)
    return (await this.userRepo.save(user)).id
  }

  async update(u: User): Promise<User> {
    const user = await this.userRepo.findOneBy({username: u.username}) as User
    if (!user) {
      throw UserException.userNotFound(u.username)
    }

    user.update(u)

    return this.userRepo.save(user)
  }
}
