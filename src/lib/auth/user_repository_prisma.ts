import { logger } from '../app/logger'
import type { PrismaClient, Theme, User } from '@prisma/client'
import type { Email } from './email'
import type { UserRepository } from './user_repository'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export class UserRepositoryPrisma implements UserRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async find_unique(email: Email, can_register = true): Promise<User | undefined> {
		const user = await this._prisma_client.user.findUnique({ where: { email: email.address } })

		if (user) return user
		if (!can_register) return undefined

		try {
			const user = await this._prisma_client.user.create({
				data: {
					role: { connect: { name: Roles.user } },
					email: email.address,
				},
			})

			logger.info(`[DB] Created new user: ${email.address}`)

			return user
		} catch (error) {
			logger.error(`[DB] Failed to create user: ${email.address}`, error)
			return undefined
		}
	}

	public async update_theme(user: User, theme: Theme): Promise<Theme | undefined> {
		try {
			await this._prisma_client.user.update({
				where: { id: user.id },
				data: { theme: theme },
			})

			logger.info(`[DB] Updated theme for user: ${user.email}`)

			return theme
		} catch (error) {
			logger.error(`[DB] Failed to update theme for user: ${user.email}`, error)
			return undefined
		}
	}
}
