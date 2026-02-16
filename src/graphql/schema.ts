export const typeDefs = `
	scalar DateTime

	type Query {
		homePage: HomePage!
		products(filter: ProductFilterInput): ProductConnection!
		product(slug: String!): Product
	}

	type HomePage {
		hero: HeroBlock
		categories: [Category!]!
		popularProducts: [Product!]!
	}

	type HeroBlock {
		title: String!
		subtitle: String
		image: String
	}

	type ProductConnection {
		items: [Product!]!
		total: Int!
	}

	type Product {
		id: ID!
		title: String!
		slug: String!
		description: String
		price: Price!
		images: [String!]!
		rating: Float
		reviewCount: Int
		category: Category!
		createdAt: DateTime!
	}

	type Category {
		id: ID!
		title: String!
		slug: String!
		image: String
	}

	type Price {
		value: Float!
		currency: Currency!
	}

	enum Currency {
		USD
		EUR
	}

	input ProductFilterInput {
		categorySlug: String
		search: String
	}

  input CreateProductInput {
    title: String!
    description: String
    priceValue: Float!
    currency: Currency!
    categoryId: String!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
}
`
