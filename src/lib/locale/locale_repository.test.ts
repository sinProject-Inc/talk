import { Repository } from '$lib/app/repository'
import { expect, it } from 'vitest'
import { LocaleCode } from './locale_code'

it('find_many', async () => {
	const locales = await Repository.locale.find_many()

	expect(locales.length).toBeGreaterThan(0)
})

it('find_unique', async () => {
	const locale_code = LocaleCode.english_united_states
	const locale = await Repository.locale.find_unique(locale_code)

	expect(locale?.code).toEqual(locale_code.code)
})
