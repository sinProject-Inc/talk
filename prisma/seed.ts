// NOTE: $ npx prisma db seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function upsert_app_settings(): Promise<void> {
	await prisma.appSetting.upsert({
		where: { key: 'session_lifetime_sec' },
		update: {},
		create: { key: 'session_lifetime_sec', value: '600' },
	})

	await prisma.appSetting.upsert({
		where: { key: 'session_lifetime_sec' },
		update: {},
		create: { key: 'pin_code_lifetime_sec', value: '300' },
	})
}

async function upsert_roles(): Promise<void> {
	await prisma.role.upsert({
		where: { name: 'admin' },
		update: {},
		create: { name: 'admin' },
	})

	await prisma.role.upsert({
		where: { name: 'user' },
		update: {},
		create: { name: 'user' },
	})

	await prisma.role.upsert({
		where: { name: 'test' },
		update: {},
		create: { name: 'test' },
	})
}

async function upsert_language_english_united_states(): Promise<void> {
	await prisma.locale.upsert({
		where: { code: 'en-US' },
		update: {},
		create: { code: 'en-US', name: 'English (US)' },
	})

	await prisma.language.upsert({
		where: { code: 'en' },
		update: {},
		create: { code: 'en', name: 'English' },
	})

	const language = await prisma.language.findUnique({
		where: { code: 'en' },
	})

	if (!language) throw new Error('Language not found.')

	await prisma.text.upsert({
		where: {
			language_id_text: {
				language_id: language.id,
				text: 'This is heavy!',
			},
		},
		update: {},
		create: { language_id: language.id, text: 'This is heavy!' },
	})
}

async function upsert_language_english_great_britain(): Promise<void> {
	await prisma.locale.upsert({
		where: { code: 'en-GB' },
		update: {},
		create: { code: 'en-GB', name: 'English (GB)' },
	})

	await prisma.language.upsert({
		where: { code: 'en' },
		update: {},
		create: { code: 'en', name: 'English' },
	})

	const language = await prisma.language.findUnique({
		where: { code: 'en' },
	})

	if (!language) throw new Error('Language not found.')

	await prisma.text.upsert({
		where: {
			language_id_text: {
				language_id: language.id,
				text: 'This is heavy!',
			},
		},
		update: {},
		create: { language_id: language.id, text: 'This is heavy!' },
	})
}

async function upsert_language_japanese(): Promise<void> {
	await prisma.locale.upsert({
		where: { code: 'ja-JP' },
		update: {},
		create: { code: 'ja-JP', name: 'Japanese (JP)' },
	})

	await prisma.language.upsert({
		where: { code: 'ja' },
		update: {},
		create: { code: 'ja', name: 'Japanese' },
	})

	const language = await prisma.language.findUnique({
		where: { code: 'ja' },
	})

	if (!language) throw new Error('Language not found.')

	await prisma.text.upsert({
		where: {
			language_id_text: {
				language_id: language.id,
				text: 'こんにちは、世界！',
			},
		},
		update: {},
		create: { language_id: language.id, text: 'こんにちは、世界！' },
	})
}

async function main(): Promise<void> {
	await upsert_app_settings()
	await upsert_roles()
	await upsert_language_english_united_states()
	await upsert_language_english_great_britain()
	await upsert_language_japanese()
}

main()
	.then(async () => {
		console.info('Done.')
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
