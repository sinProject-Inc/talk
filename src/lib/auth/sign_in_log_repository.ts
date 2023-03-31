import type { SignInLog } from '@prisma/client'
import type { Email } from './email'
import type { IPAddress } from './ip_address'

export interface SignInLogRepository {
	consecutive_fail(ip_address: IPAddress, email: Email): Promise<boolean>
	save(ip_address: IPAddress, email: Email, success: boolean): Promise<SignInLog>
}
