import type { SpeechLanguageCode } from "$lib/speech/speech_language_code"
import type { Language } from "@prisma/client"

export interface LanguageRepository {
	find_many(): Promise<Language[]>
	find_unique(speech_language_code: SpeechLanguageCode): Promise<Language | null>
}