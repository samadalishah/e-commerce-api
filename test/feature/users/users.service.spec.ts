import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../../../src/main/feature/users/users.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import User from '../../../src/main/domain/user/user.entity'
import { Repository } from 'typeorm'
import { UserException } from '../../../src/main/domain/user/user.exception'

describe('UsersService', () => {
  let service: UsersService
  let userRepo: jest.Mocked<Repository<User>>
  const mockQueryBuilder = {
    delete: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() => mockQueryBuilder),
          },
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    userRepo = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  
  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1 }, { id: 2 }] as User[]
      userRepo.find.mockResolvedValue(users)

      const result = await service.findAll()
      expect(result).toEqual(users)
      expect(userRepo.find).toHaveBeenCalled()
    })
  })

  describe('get', () => {
    it('should return a user by username', async () => {
      const user = { id: 1, username: 'testuser' } as User
      userRepo.findOneBy.mockResolvedValue(user)

      const result = await service.get('testuser')
      expect(result).toEqual(user)
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ username: 'testuser' })
    })

    it('should throw UserException if user not found', async () => {
      userRepo.findOneBy.mockResolvedValue(null)

      await expect(service.get('nonexistent')).rejects.toThrow(UserException.notFound('nonexistent'))
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ username: 'nonexistent' })
    })
  })

  describe('create', () => {
    it('should create a new user and return its id', async () => {
      const newUser = { username: 'newuser' } as User
      const savedUser = { id: 1, username: 'newuser' } as User

      userRepo.findOneBy.mockResolvedValue(null)
      userRepo.create.mockReturnValue(newUser)
      userRepo.save.mockResolvedValue(savedUser)

      const result = await service.create(newUser)
      expect(result).toEqual(1)
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ username: 'newuser' })
      expect(userRepo.create).toHaveBeenCalledWith(newUser)
      expect(userRepo.save).toHaveBeenCalledWith(newUser)
    })

    it('should throw UserException if user already exists', async () => {
      const existingUser = { id: 1, username: 'existing' } as User
      userRepo.findOneBy.mockResolvedValue(existingUser)

      await expect(service.create(existingUser)).rejects.toThrow(UserException.alreadyExists('existing'))
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ username: 'existing' })
    })
  })

  describe('update', () => {
    it('should update an existing user', async () => {
      const existingUser = {
        id: 1,
        username: 'user1',
        update: jest.fn(),
      } as unknown as User

      const updateData = { username: 'user1' } as User

      userRepo.findOneBy.mockResolvedValue(existingUser)
      userRepo.save.mockResolvedValue(existingUser)

      const result = await service.update(updateData)

      expect(existingUser.update).toHaveBeenCalledWith(updateData)
      expect(userRepo.save).toHaveBeenCalledWith(existingUser)
      expect(result).toEqual(existingUser)
    })

    it('should throw UserException if user does not exist', async () => {
      userRepo.findOneBy.mockResolvedValue(null)

      await expect(service.update({ username: 'unknown' } as User)).rejects.toThrow(UserException.notFound('unknown'))
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ username: 'unknown' })
    })
  })

  describe('delete', () => {
    it('should delete an existing user', async () => {
      const existingUser = { id: 1 } as User
      userRepo.findOneBy.mockResolvedValue(existingUser)
    
      await service.delete(1)
    
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 1 })
      expect(mockQueryBuilder.delete).toHaveBeenCalled()
      expect(mockQueryBuilder.from).toHaveBeenCalledWith(User)
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id: 1 })
      expect(mockQueryBuilder.execute).toHaveBeenCalled()
    })

    it('should throw UserException if user does not exist', async () => {
      userRepo.findOneBy.mockResolvedValue(null)

      await expect(service.delete(999)).rejects.toThrow(UserException.notFound(999))
      expect(userRepo.findOneBy).toHaveBeenCalledWith({ id: 999 })
    })
  })
})
