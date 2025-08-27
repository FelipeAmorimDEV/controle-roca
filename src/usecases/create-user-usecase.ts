import { UserRepository } from '@/repository/user-repository'
import { Users } from '@prisma/client'
import { UserAlreadyExists } from './errors/user-already-exist'
import { hash } from 'bcryptjs'

interface CreateUserUseCaseParams {
  user: string
  password: string
  fazendaId: string
  nome: string
  fazendaNome: string
}

interface CreateUserUseCaseResponse {
  users: Users
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    user,
    password,
    fazendaId,
    fazendaNome, 
    nome
  }: CreateUserUseCaseParams): Promise<CreateUserUseCaseResponse> {
    const userAlreadyExist = await this.userRepository.findUserByUsername(user)

    if (userAlreadyExist) {
      throw new UserAlreadyExists()
    }

    const password_hash = await hash(password, 6)

    const users = await this.userRepository.createUser({
      user,
      password: password_hash,
      fazenda_id: fazendaId,
      fazenda_nome: fazendaNome,
      nome
    })

    return { users }
  }
}
