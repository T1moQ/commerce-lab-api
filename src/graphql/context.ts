import { PrismaClient } from '@prisma/client/extension'

export type GraphQLContext = {
	prisma: PrismaClient
}
