import { logger } from '$lib/app/logger'
import type { WebLog } from '$lib/view/web_logger'
import type { RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request }) => {
	const web_log = (await request.json()) as WebLog

	logger.info(`[WEB] ${web_log.log_type}: ${web_log.message}`)

	return new Response(undefined, { status: 200 })
}
