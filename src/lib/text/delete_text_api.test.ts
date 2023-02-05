import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import { SpeechText } from '$lib/speech/speech_text'
import { expect, test } from 'vitest'
import { AddTextApi } from './add_text_api'
import { DeleteTextApi } from './delete_text_api'
import { TextsApi } from './texts_api'

const origin = 'http://localhost:5173'

test('Delete text', async () => {
  const speech_text = new SpeechText("test string here")
  const speech_language_code =  SpeechLanguageCode.create('en')

  const text = await new AddTextApi(speech_language_code, speech_text, origin).fetch()

  expect(text.text).toBe(speech_text.text)

  await new DeleteTextApi(text, origin).fetch()


  const recent_texts = await new TextsApi(speech_language_code, 5, origin).fetch()

  for(const recent_text of recent_texts) {
    expect(recent_text.text).not.toBe(speech_text.text)
  }
})
