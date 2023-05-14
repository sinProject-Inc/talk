/* eslint-disable @typescript-eslint/naming-convention */

import { logger } from '$lib/app/logger'
import { Avatar } from '$lib/avatar/avatar'
import { UserId } from '$lib/user/user_id'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params }): Promise<Response> => {
	try {
		const user_id = UserId.from_string(params.user_id)
		const avatar = await Avatar.from_user_id(user_id)

		const image = avatar.data

		const response = new Response(image, {
			headers: {
				'Content-Type': 'image/jpg',
				'Content-Length': image.length.toString(),
			},
			status: 200,
		})

		return response
	} catch (error) {
		logger.error(`[avatar] Failed to find avatar: ${params.user_id}]`, error)
		return json({ error: (error as Error).message })
	}
}
