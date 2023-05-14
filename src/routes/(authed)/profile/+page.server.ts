import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { Email } from '$lib/auth/email'
import { redirect, type Actions } from '@sveltejs/kit'
import fs from 'fs'
import { AVATAR_DIR } from '$env/static/private'
import type { PageServerLoad } from '../$types'
import { base } from '$app/paths'
import { UserId } from '$lib/user/user_id'

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

			fs.writeFileSync(`${AVATAR_DIR}/${user.id}.jpg`, image_data)
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
