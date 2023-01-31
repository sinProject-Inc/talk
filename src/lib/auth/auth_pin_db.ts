import { App } from '$lib/app/app'
import type { PinCode } from '$lib/auth/pin_code'
import type { AuthPin, User } from '@prisma/client'
import { LifeTime } from './life_time'

export class AuthPinDb {
	private async _get_limit_date(): Promise<Date> {
		const life_time = await LifeTime.generate_pin_code()
		const limit_date = life_time.limit_date

		return limit_date
	}

	public async find(email: string, pin_code: string): Promise<AuthPin | null> {
		const pin_limit_date = await this._get_limit_date()

		const auth_pin = await App.db.authPin.findFirst({
			where: {
				updated_at: { gte: pin_limit_date },
				pin_code,
				user: {
					email,
				},
			},
		})

		return auth_pin
	}

	public async delete(auth_pin_id: number): Promise<void> {
		await App.db.authPin.delete({ where: { id: auth_pin_id } })
	}

	public async upsert(user: User, pin_code: PinCode): Promise<AuthPin> {
		const user_id = user.id

		return await App.db.authPin.upsert({
			where: { user_id },
			update: { pin_code: pin_code.code },
			create: { user_id, pin_code: pin_code.code },
		})
	}
}
