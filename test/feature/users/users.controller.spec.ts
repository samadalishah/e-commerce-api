import { Test, TestingModule } from '@nestjs/testing'
import { UsersController } from '../../../src/main/feature/users/users.controller'
import { UsersService } from '../../../src/main/feature/users/users.service'
import User from '../../../src/main/domain/user/user.entity'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  const mockUsersService = {
    findAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const users = [new User()]
      mockUsersService.findAll.mockResolvedValue(users)

      expect(await controller.getUsers()).toEqual(users)
      expect(mockUsersService.findAll).toHaveBeenCalled()
    })
  })

  describe('getUser', () => {
    it('should return a single user', async () => {
      const user = new User()
      mockUsersService.get.mockResolvedValue(user)

      expect(await controller.getUser('testuser')).toEqual(user)
      expect(mockUsersService.get).toHaveBeenCalledWith('testuser')
    })
  })

  describe('createUser', () => {
    it('should create a new user and return its id', async () => {
      mockUsersService.create.mockResolvedValue(1)

      const userRequest = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      expect(await controller.createUser(userRequest)).toEqual(1)

      expect(mockUsersService.create).toHaveBeenCalled()
      const calledUser = mockUsersService.create.mock.calls[0][0]
      expect(calledUser).toMatchObject(userRequest)
    })
  })

  describe('updateUser', () => {
    it('should update a user and return it', async () => {
      const updatedUser = new User()
      mockUsersService.update.mockResolvedValue(updatedUser)

      const userRequest = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      }

      expect(await controller.updateUser(userRequest)).toEqual(updatedUser)

      expect(mockUsersService.update).toHaveBeenCalled()
      const calledUser = mockUsersService.update.mock.calls[0][0]
      expect(calledUser).toMatchObject(userRequest)
    })
  })

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      mockUsersService.delete.mockResolvedValue(undefined)

      expect(await controller.deleteUser('1')).toBeUndefined()
      expect(mockUsersService.delete).toHaveBeenCalledWith(1)
    })
  })
})
