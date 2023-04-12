import { logger } from '$lib/app/logger'
import { BackgroundIndex } from '$lib//background/background_index'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params, cookies }) => {
	try {
		const background_index = BackgroundIndex.from_string(params.index)

		cookies.set('background_index', background_index.index.toString(), {
			path: '/',
		})
		return new Response(background_index.index.toString(), { status: 200 })
	} catch (error) {
		logger.error(`Failed to set background index: ${params.index}]`, error)
		return new Response((error as Error).message, { status: 400 })
	}
}
