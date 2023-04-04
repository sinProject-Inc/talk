import { logger } from '$lib/app/logger'
import type { WebLog } from '$lib/view/web_logger'
import type { RequestHandler } from '@sveltejs/kit'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// TODO: エラー判定

	const web_log = (await request.json()) as WebLog

	logger.log(web_log.log_level, `${getClientAddress()} [WEB] ${web_log.message}`)

	return new Response(undefined, { status: 200 })
}
