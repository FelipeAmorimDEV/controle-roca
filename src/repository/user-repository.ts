import { Prisma, Users } from '@prisma/client'

export interface UserRepository {
  findUserByUsername(username: string): Promise<Users | null>
  createUser(data: Prisma.UsersCreateInput): Promise<Users>
}
