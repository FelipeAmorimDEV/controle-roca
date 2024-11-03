import { Prisma, Users } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { prisma } from '@/prisma'

export class PrismaUserRepository implements UserRepository {
  async findUserByUsername(username: string): Promise<Users | null> {
    const user = await prisma.users.findUnique({
      where: {
        user: username,
      },
    })

    return user
  }

  async createUser(data: Prisma.UsersUncheckedCreateInput): Promise<Users> {
    const user = await prisma.users.create({
      data,
    })

    return user
  }
}
