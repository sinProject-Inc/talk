import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { expect, test } from 'vitest'
import { SpeechText } from '../speech_text'

test('save', async () => {
	const locale_code = LocaleCode.japanese_japan
	const speech_text = new SpeechText('こんにちは')

	const sound = await Repository.sound.save(locale_code, speech_text)

	expect(sound.sound_text).toEqual(speech_text.text)

	const sound2 = await Repository.sound.find_unique(locale_code, speech_text)

	expect(sound2?.sound_text).toEqual(speech_text.text)
})
