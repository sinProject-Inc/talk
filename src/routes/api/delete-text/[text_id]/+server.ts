import { App } from '$lib/app/app'
import { TextId } from '$lib/text/text_id'
import { TextRepositoryPrisma } from '$lib/text/text_repository_prisma'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	try {
		const text_repository = new TextRepositoryPrisma(App.prisma_client)
		const text_id = TextId.from_string(params.text_id)

		const result = await text_repository.delete(text_id)
		
		return json(result)
	} catch (error) {
		console.error(error)
		return new Response((error as Error).message, { status: 400 })
	}
}
