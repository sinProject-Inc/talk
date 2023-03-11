import type { SpeechLanguageCode } from '$lib/speech/speech_language_code'
import type { SpeechText } from '$lib/speech/speech_text'
import type { TextId } from '$lib/text/text_id'
import type { Text } from '@prisma/client'

export interface TranslationRepository {
	find_many(text_id: TextId, speech_language_code: SpeechLanguageCode): Promise<Text[]>
	save(
		text_id: TextId,
		speech_language_code: SpeechLanguageCode,
		translation_speech_text: SpeechText
	): Promise<Text>
}
