import { Repository } from '$lib/app/repository'
import { expect, it } from 'vitest'
import { Email } from './email'

it('find_unique: new', async () => {
	const email = new Email('test@example.com')

	try {
		await Repository.context.user.delete({ where: { email: email.address } })
	} catch (e) {
		// DO NOTHING
	}

	const user = await Repository.user.find_unique(email)

	expect(user?.email).toEqual(email.address)
})

it('find_unique: exist', async () => {
	const email = new Email('testtest@example.com')

	try {
		await Repository.context.user.delete({ where: { email: email.address } })
	} catch (e) {
		// DO NOTHING
	}

	await Repository.user.find_unique(email)

	const user = await Repository.user.find_unique(email)

	expect(user?.email).toEqual(email.address)
})
