import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { typeDefs } from './graphql/schema'
import { resolvers } from './graphql/resolvers'
import type { GraphQLContext } from './graphql/context'
import { expressMiddleware } from '@as-integrations/express5'
import { PrismaClient } from '@prisma/client'

async function bootstrap() {
	const app = express()
	const prisma = new PrismaClient()

	app.use(cors({ origin: true, credentials: true }))
	app.use(express.json())

	const apollo = new ApolloServer<GraphQLContext>({
		typeDefs,
		resolvers,
	})

	await apollo.start()

	app.use(
		'/graphql',
		expressMiddleware(apollo, {
			context: async () => ({ prisma }),
		}),
	)

	const port = Number(process.env.PORT ?? 4000)
	app.listen(port, () => {
		console.log(`🚀 API ready at http://localhost:${port}/graphql`)
	})
}

bootstrap().catch((e) => {
	console.error(e)
	process.exit(1)
})
