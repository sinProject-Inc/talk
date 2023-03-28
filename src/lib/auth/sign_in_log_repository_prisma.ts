import { AppSettingRepositoryPrisma } from '$lib/app/app_setting_repository_prisma'
import { SettingKey } from '$lib/app/setting_key'
import type { PrismaClient, SignInLog } from '@prisma/client'
import type { Email } from './email'
import type { IPAddress } from './ip_address'
import type { SignInLogRepository } from './sign_in_log_repository'

export class SignInLogRepositoryPrisma implements SignInLogRepository {
	public constructor(private readonly _prisma_client: PrismaClient) {}

	private async _consecutive_fail_by_ip_address(
		ip_address: IPAddress,
		period_sec: number,
		count: number
	): Promise<boolean> {
		const result = await this._prisma_client.signInLog.findMany({
			where: {
				created_at: { gte: new Date(Date.now() - period_sec * 1000) },
				ip_address: ip_address.address,
			},
			orderBy: { created_at: 'desc' },
			take: count,
		})

		const consecutive_fail = result.filter((log) => !log.success).length >= count

		return consecutive_fail
	}

	private async _consecutive_fail_by_email(
		email: Email,
		period_sec: number,
		count: number
	): Promise<boolean> {
		const result = await this._prisma_client.signInLog.findMany({
			where: {
				created_at: { gte: new Date(Date.now() - period_sec * 1000) },
				account: email.address,
			},
			orderBy: { created_at: 'desc' },
			take: count,
		})

		const consecutive_fail = result.filter((log) => !log.success).length >= count

		return consecutive_fail
	}

	public async consecutive_fail(ip_address: IPAddress, email: Email): Promise<boolean> {
		const app_setting_repository = new AppSettingRepositoryPrisma(this._prisma_client)
		const consecutive_fail_period_sec = await app_setting_repository.get_number(
			SettingKey.consecutive_fail_period_sec
		)
		const consecutive_fail_count = await app_setting_repository.get_number(
			SettingKey.consecutive_fail_count
		)

		const consecutive_fail_by_ip_address = await this._consecutive_fail_by_ip_address(
			ip_address,
			consecutive_fail_period_sec,
			consecutive_fail_count
		)
		const consecutive_fail_by_email = await this._consecutive_fail_by_email(
			email,
			consecutive_fail_period_sec,
			consecutive_fail_count
		)

		return consecutive_fail_by_ip_address || consecutive_fail_by_email
	}

	public async save(ip_address: IPAddress, email: Email, success: boolean): Promise<SignInLog> {
		const sign_in_log = await this._prisma_client.signInLog.create({
			data: {
				ip_address: ip_address.address,
				account: email.address,
				success,
			},
		})

		return sign_in_log
	}
}
