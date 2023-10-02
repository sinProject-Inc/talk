import type { Text } from '@prisma/client'
import type { LocaleCode } from '../locale/locale_code'
import type { SpeechText } from '../speech/speech_text'
import type { TextId } from './text_id'
import type { TextLimit } from './text_limit'

export interface TextRepository {
	find_by_id(text_id: TextId): Promise<Text | null>
	find(locale_code: LocaleCode, speech_text: SpeechText): Promise<Text | null>
	find_many(locale_code: LocaleCode, limit?: TextLimit): Promise<Text[]>
	save(locale_code: LocaleCode, speech_text: SpeechText): Promise<Text>
	delete(text_id: TextId): Promise<Text>
}
