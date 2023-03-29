import type { AuthPin, User } from '@prisma/client'
import type { Email } from './email'
import type { PinCode } from './pin_code'

export interface AuthPinRepository {
	find(email: Email, pin_code: PinCode): Promise<AuthPin | null>
	delete(auth_pin: AuthPin): Promise<void>
	save(user: User, pin_code: PinCode): Promise<AuthPin>
}
