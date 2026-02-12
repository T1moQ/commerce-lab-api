import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	await prisma.productImage.deleteMany()
	await prisma.product.deleteMany()
	await prisma.category.deleteMany()

	const categories = await prisma.category.createMany({
		data: [
			{ title: 'Supplements', slug: 'supplements' },
			{ title: 'Skincare', slug: 'skincare' },
			{ title: 'Tea & Herbs', slug: 'tea-herbs' },
			{ title: 'Wellness', slug: 'wellness' },
			{ title: 'Beauty', slug: 'beauty' },
		],
	})

	const allCategories = await prisma.category.findMany()

	const makeProduct = (i: number) => {
		const cat = allCategories[i % allCategories.length]
		return {
			title: `Product ${i + 1}`,
			slug: `product-${i + 1}`,
			description: `Description for product ${i + 1}`,
			priceValue: 9.99 + i,
			currency: 'USD',
			rating: (i % 5) + 0.2,
			reviewCount: 10 + i,
			categoryId: cat.id,
			images: [
				{ url: `https://picsum.photos/seed/${i + 1}/800/800` },
				{ url: `https://picsum.photos/seed/${i + 1}-b/800/800` },
			],
		}
	}

	for (let i = 0; i < 20; i++) {
		const p = makeProduct(i)
		await prisma.product.create({
			data: {
				title: p.title,
				slug: p.slug,
				description: p.description,
				priceValue: p.priceValue,
				currency: 'USD',
				rating: p.rating,
				reviewCount: p.reviewCount,
				categoryId: p.categoryId,
				images: { create: p.images },
			},
		})
	}
}

main()
	.then(async () => prisma.$disconnect())
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
