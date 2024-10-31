import { UserRepository } from '@/repository/user-repository'
import { Users } from '@prisma/client'
import { UserAlreadyExists } from './errors/user-already-exist'
import { hash } from 'bcryptjs'

interface CreateUserUseCaseParams {
  user: string
  password: string
}

interface CreateUserUseCaseResponse {
  users: Users
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    user,
    password,
  }: CreateUserUseCaseParams): Promise<CreateUserUseCaseResponse> {
    const userAlreadyExist = await this.userRepository.findUserByUsername(user)

    if (userAlreadyExist) {
      throw new UserAlreadyExists()
    }

    const password_hash = await hash(password, 6)

    const users = await this.userRepository.createUser({
      user,
      password: password_hash,
    })

    return { users }
  }
}
