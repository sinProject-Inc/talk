// NOTE: $ npx prisma db seed
// NOTE: https://cloud.google.com/text-to-speech?hl=ja

import { PrismaClient } from '@prisma/client'
import { AppSettingSeeder } from './seed/app_setting_seeder'
import { LocaleSeeder } from './seed/locale_seeder'
import { RoleSeeder } from './seed/role_seeder'
import { VoiceSeeder } from './seed/voice_seeder'
import { logger } from '../src/lib/app/logger'

const prisma = new PrismaClient()

async function main(): Promise<void> {
	await new AppSettingSeeder(prisma).execute()
	await new RoleSeeder(prisma).execute()
	await new LocaleSeeder(prisma).execute()
	await new VoiceSeeder(prisma).execute()
}

main()
	.then(async () => {
		logger.info('[DB] Seeding finished')
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		logger.error('[DB] Seeding failed', e)
		await prisma.$disconnect()
		process.exit(1)
	})
