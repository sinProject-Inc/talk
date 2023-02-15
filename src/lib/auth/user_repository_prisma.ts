import { App } from '$lib/app/app'
import type { User } from '@prisma/client'
import type { Email } from './email'
import type { UserRepository } from './user_repository'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export class UserRepositoryPrisma implements UserRepository {
	public constructor(private readonly _email: Email) {}

	public async find_unique(can_register = true): Promise<User | undefined> {
		const user = await App.db.user.findUnique({ where: { email: this._email.address } })

		if (user) return user
		if (!can_register) return undefined

		try {
			return await App.db.user.create({
				data: {
					role: { connect: { name: Roles.user } },
					email: this._email.address,
				},
			})
		} catch (error) {
			console.error(error)
			return undefined
		}
	}
}
