import { App } from '$lib/app/app'
import type { AuthToken, Role, User } from '@prisma/client'
import { LifeTime } from './life_time'

export class AuthTokenDb {
	private async _get_life_time(): Promise<LifeTime> {
		const life_time = await LifeTime.generate_session()

		return life_time
	}

	private async _get_limit_date(): Promise<Date> {
		const life_time = await this._get_life_time()
		const limit_date = life_time.limit_date

		return limit_date
	}

	public async find(session_id: string): Promise<
		| (AuthToken & {
				user: User & {
					role: Role
				}
		  })
		| null
	> {
		const session_limit_date = await this._get_limit_date()
		const auth_token = await App.db.authToken.findFirst({
			where: {
				updated_at: { gte: session_limit_date },
				token: session_id,
			},
			include: {
				user: {
					include: {
						role: true,
					},
				},
			},
		})

		return auth_token
	}

	public async create(user_id: number): Promise<[AuthToken, LifeTime]> {
		const session_life_time = await this._get_life_time()
		const session_limit_date = session_life_time.limit_date

		const [auth_token] = await App.db.$transaction([
			App.db.authToken.create({
				data: { user_id, token: crypto.randomUUID() },
			}),
			App.db.authToken.deleteMany({
				where: { updated_at: { lt: session_limit_date } },
			}),
		])

		return [auth_token, session_life_time]
	}

	public async update(auth_token_id: number): Promise<[AuthToken, LifeTime]> {
		const session_life_time = await this._get_life_time()

		const auth_token = await App.db.authToken.update({
			where: { id: auth_token_id },
			data: { updated_at: new Date() },
		})

		return [auth_token, session_life_time]
	}

	public async delete(token: string): Promise<void> {
		await App.db.authToken.delete({ where: { token } })
	}
}
