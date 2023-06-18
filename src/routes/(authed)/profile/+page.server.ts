import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { Email } from '$lib/auth/email'
import { redirect, type Actions } from '@sveltejs/kit'
import fs from 'fs'
import { AVATAR_DIR } from '$env/static/private'
import type { PageServerLoad } from './$types'
import { base } from '$app/paths'
import { UserId } from '$lib/user/user_id'
import { AvatarExtension } from '@prisma/client'

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData()
		const image = data.get('image')

		const email = new Email(locals.user.email)
		const user = await Repository.user.find_unique(email)

		if (!user) throw new Error('user is null')

		try {
			if (!(image instanceof Blob)) throw new Error('not an image')

			const image_data = new Uint8Array(await image.arrayBuffer())
			const image_extension = image.type.split('/')[1]
			const avatar_extension = to_avatar_extension(image_extension)

			await Repository.user.update_avatar_extension(user, avatar_extension)

			delete_avatars(new UserId(user.id))

			fs.writeFileSync(`${AVATAR_DIR}/${user.id}.${image_extension}`, image_data)
		} catch (e) {
			logger.error(e)
		}
	},
}

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) {
		throw redirect(303, `${base}/sign-in?redirect_url=${url.pathname}`)
	}

	const email = new Email(locals.user.email)
	const user = await Repository.user.find_unique(email)

	if (!user) throw new Error('user is null')

	const user_id = new UserId(user.id)

	return {
		user_id: user_id.id,
		email: email.address,
	}
}

function to_avatar_extension(string: string): AvatarExtension {
	switch (string) {
		case 'jpeg':
			return AvatarExtension.jpeg
		case 'jpg':
			return AvatarExtension.jpg
		case 'png':
			return AvatarExtension.png
		default:
			throw new Error('invalid extension')
	}
}

function delete_avatars(user_id: UserId): void {
	fs.readdirSync(AVATAR_DIR)
		.filter((file) => {
			const file_user_id = file.split('.')[0]
			return file_user_id === String(user_id.id)
		})
		.forEach((file) => {
			fs.unlinkSync(`${AVATAR_DIR}/${file}`)
		})
}
