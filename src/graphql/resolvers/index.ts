import type { GraphQLContext } from '../context'

export const resolvers = {
	Query: {
		homePage: async (_: unknown, __: unknown, ctx: GraphQLContext) => {
			const categories = await ctx.prisma.category.findMany({
				orderBy: { createdAt: 'desc' },
			})
			const popularProducts = await ctx.prisma.product.findMany({
				take: 8,
				orderBy: { createdAt: 'desc' },
				include: { images: true, category: true },
			})

			return {
				hero: {
					title: 'Commerce Lab',
					subtitle: 'Practice e-commerce like in production',
					image: null,
				},
				categories,
				popularProducts,
			}
		},

		products: async (
			_: unknown,
			args: { filter?: { categorySlug?: string; search?: string } },
			ctx: GraphQLContext,
		) => {
			const { filter } = args

			const where: any = {}

			if (filter?.search) {
				where.title = { contains: filter.search, mode: 'insensitive' }
			}

			if (filter?.categorySlug) {
				where.category = { slug: filter.categorySlug }
			}

			const [items, total] = await Promise.all([
				ctx.prisma.product.findMany({
					where,
					orderBy: { createdAt: 'desc' },
					include: { images: true, category: true },
				}),
				ctx.prisma.product.count({ where }),
			])

			return { items, total }
		},

		product: async (
			_: unknown,
			args: { slug: string },
			ctx: GraphQLContext,
		) => {
			return ctx.prisma.product.findUnique({
				where: { slug: args.slug },
				include: { images: true, category: true },
			})
		},
	},

	Mutation: {
		createProduct: async (
			_: any,
			{
				input,
			}: {
				input: {
					title: string
					description: string
					priceValue: string
					currency: unknown
					categoryId: string
				}
			},
			ctx: GraphQLContext,
		) => {
			const slug = input.title.toLowerCase().replace(/\s+/g, '-')

			return ctx.prisma.product.create({
				data: {
					title: input.title,
					slug,
					description: input.description ?? null,
					priceValue: input.priceValue,
					currency: input.currency,
					categoryId: input.categoryId,
				},
			})
		},
	},

	Product: {
		price: (p: any) => ({ value: p.priceValue, currency: p.currency }),
		images: (p: any) => (p.images ?? []).map((i: any) => i.url),
	},
}
