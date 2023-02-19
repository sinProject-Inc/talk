import type { Session } from '$lib/auth/session'
import type { AuthPin, AuthToken, PrismaClient, Role, User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import type { AuthTokenRepository } from './auth_token_repository'
import { LifeTime } from './life_time'

export class AuthTokenRepositoryPrisma implements AuthTokenRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	private async _get_life_time(): Promise<LifeTime> {
		const life_time = await LifeTime.generate_session()

		return life_time
	}

	private async _get_limit_date(): Promise<Date> {
		const life_time = await this._get_life_time()
		const limit_date = life_time.limit_date

		return limit_date
	}

	public async find(session: Session): Promise<
		| (AuthToken & {
				user: User & {
					role: Role
				}
		  })
		| null
	> {
		const session_limit_date = await this._get_limit_date()
		const auth_token = await this._prisma_client.authToken.findFirst({
			where: {
				updated_at: { gte: session_limit_date },
				token: session.id,
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

	public async create(auth_pin: AuthPin): Promise<[AuthToken, LifeTime]> {
		const session_life_time = await this._get_life_time()
		const token = uuidv4()
		const session_limit_date = session_life_time.limit_date

		const [auth_token] = await this._prisma_client.$transaction([
			this._prisma_client.authToken.create({
				data: { user_id: auth_pin.user_id, token },
			}),
			this._prisma_client.authToken.deleteMany({
				where: { updated_at: { lt: session_limit_date } },
			}),
		])

		return [auth_token, session_life_time]
	}

	public async update(auth_token: AuthToken): Promise<[AuthToken, LifeTime]> {
		const session_life_time = await this._get_life_time()

		const updated_auth_token = await this._prisma_client.authToken.update({
			where: { id: auth_token.id },
			data: { updated_at: new Date() },
		})

		return [updated_auth_token, session_life_time]
	}

	public async delete(session: Session): Promise<void> {
		await this._prisma_client.authToken.delete({ where: { token: session.id } })
	}
}
