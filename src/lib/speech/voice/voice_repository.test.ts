import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { expect, it } from 'vitest'

it('find_first_by_locale_code', async () => {
	const locale_code = LocaleCode.japanese_japan
	const voice = await Repository.voice.find_first_by_locale_code(locale_code)

	expect(voice?.locale.code).toEqual(locale_code.code)
})
