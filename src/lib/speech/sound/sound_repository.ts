import type { LocaleCode } from "$lib/locale/locale_code"
import type { Sound } from "@prisma/client"
import type { SpeechText } from "../speech_text"

export interface SoundRepository {
	save(locale_code: LocaleCode, speech_text: SpeechText): Promise<Sound>
	find_first(locale_code: LocaleCode, speech_text: SpeechText): Promise<Sound | null>
}