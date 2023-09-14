/* eslint-disable @typescript-eslint/naming-convention */

import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { Email } from '$lib/auth/email'
import { Avatar } from '$lib/avatar/avatar'
import { UserId } from '$lib/user/user_id'
import { AvatarExtension } from '@prisma/client'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ params, locals }): Promise<Response> => {
	try {
		const user_id = UserId.from_string(params.user_id)
		const email = new Email(locals.user.email)
		const user = await Repository.user.find_unique(email)

		if (!user) throw new Error('user is null')

		const extension = user.avatar_extension
		const content_type = extension === AvatarExtension.jpg ? AvatarExtension.jpeg : extension

		const avatar = await Avatar.from_user_id(user_id, extension)
		const image = avatar.data

		const response = new Response(image, {
			headers: {
				'Content-Type': `image/${content_type}`,
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
