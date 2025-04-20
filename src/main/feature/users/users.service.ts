import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import User from '../../domain/user/user.entity'
import { UserException } from '../../domain/user/user.exception'

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find()
  }

  async get(username: string): Promise<User> {
    const user = await this.userRepo.findOneBy({username: username}) as User
    if (!user) {
      throw UserException.notFound(username)
    }

    return user
  }

  async create(u: User): Promise<number> {
    const existingUser = await this.userRepo.findOneBy({username: u.username}) as User
    if (existingUser) {
      throw UserException.alreadyExists(u.username)
    }

    const user = this.userRepo.create(u)
    return (await this.userRepo.save(user)).id
  }

  async update(u: User): Promise<User> {
    const user = await this.userRepo.findOneBy({username: u.username}) as User
    if (!user) {
      throw UserException.notFound(u.username)
    }

    user.update(u)

    return this.userRepo.save(user)
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepo.findOneBy({id: id})
    if (!user) {
      throw UserException.notFound(id)
    }

    this.userRepo.createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id: id })
      .execute()
  }
}
