import type { PinCode } from '$lib/auth/pin_code'
import type { AuthPin, PrismaClient, User } from '@prisma/client'
import type { AuthPinRepository } from './auth_pin_repository'
import type { Email } from './email'
import { LifeTime } from './life_time'

export class AuthPinRepositoryPrisma implements AuthPinRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	private async _get_limit_date(): Promise<Date> {
		const life_time = await LifeTime.generate_pin_code()
		const limit_date = life_time.limit_date

		return limit_date
	}

	public async find(email: Email, pin_code: PinCode): Promise<AuthPin | null> {
		const pin_limit_date = await this._get_limit_date()

		const auth_pin = await this._prisma_client.authPin.findFirst({
			where: {
				updated_at: { gte: pin_limit_date },
				pin_code: pin_code.code,
				user: {
					email: email.address,
				},
			},
		})

		return auth_pin
	}

	public async delete(auth_pin: AuthPin): Promise<void> {
		await this._prisma_client.authPin.delete({ where: { id: auth_pin.id } })
	}

	public async save(user: User, pin_code: PinCode): Promise<AuthPin> {
		const user_id = user.id

		return await this._prisma_client.authPin.upsert({
			where: { user_id },
			update: { pin_code: pin_code.code },
			create: { user_id, pin_code: pin_code.code },
		})
	}
}
