import { UserRepository } from '@/repository/user-repository'
import { Users } from '@prisma/client'
import { compare } from 'bcryptjs'
import { CredentialInvalid } from './errors/credential-invalid'

interface AuthenticateUserUseCaseParams {
  user: string
  password: string
}

interface AuthenticateUserUseCaseResponse {
  users: Users
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    user,
    password,
  }: AuthenticateUserUseCaseParams): Promise<AuthenticateUserUseCaseResponse> {
    const username = await this.userRepository.findUserByUsername(user)

    if (!username) {
      throw new CredentialInvalid()
    }

    const passwordMatch = await compare(password, username.password)

    if (!passwordMatch) {
      throw new CredentialInvalid()
    }

    return { users: username }
  }
}
