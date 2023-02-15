import type { SpeechText } from "$lib/speech/speech_text"
import type { Text } from "@prisma/client"

export interface TranslationRepository {
	find(): Promise<Text[]>
	add(translation_speech_text: SpeechText): Promise<Text>
}
