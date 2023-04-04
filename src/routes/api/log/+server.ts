import { logger } from '$lib/app/logger'
import type { WebLog } from '$lib/view/log/web_log'
import { WebLogLevel } from '$lib/view/log/web_log_level'
import type { RequestHandler } from '@sveltejs/kit'

// eslint-disable-next-line @typescript-eslint/naming-convention
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const web_log = (await request.json()) as WebLog
		const web_log_level = WebLogLevel.from(web_log.level.value)

		logger.log(web_log_level.value, `${getClientAddress()} [WEB] ${web_log.message}`)

		return new Response(undefined, { status: 200 })
	} catch (e) {
		logger.info(`${getClientAddress()} [${request.method}] ${request.url}`)
		logger.error(e)
		return new Response(undefined, { status: 404 })
	}
}
