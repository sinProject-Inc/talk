import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { expect, test } from 'vitest'
import { TextsApi } from './texts_api'

const origin = 'http://localhost:5173'

test('Fetch 5 texts', async () => {
  const speech_language_code = SpeechLanguageCode.create('en')
  const texts = await new TextsApi(speech_language_code, 5, origin).fetch()

  expect(texts).toHaveLength(5)
})
