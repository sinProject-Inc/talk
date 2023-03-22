import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { TextId } from '$lib/text/text_id'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url, params }) => {
	try {
		const text_id = TextId.from_string(params.text_id)
		const result = await Repository.text.delete(text_id)

		return json(result)
	} catch (error) {
		logger.error(`[database] Failed to delete text: ${params.text_id}]`, error)
		return new Response((error as Error).message, { status: 400 })
	}
}
