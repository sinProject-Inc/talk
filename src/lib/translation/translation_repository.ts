import type { LocaleCode } from '$lib/locale/locale_code'
import type { SpeechText } from '$lib/speech/speech_text'
import type { TextId } from '$lib/text/text_id'
import type { Text } from '@prisma/client'

export interface TranslationRepository {
	find_many(text_id: TextId, locale_code: LocaleCode): Promise<Text[]>
	save(text_id: TextId, locale_code: LocaleCode, translation_speech_text: SpeechText): Promise<Text>
}
