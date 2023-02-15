import type { SpeechLanguageCode } from "$lib/speech/speech_language_code";
import type { SpeechText } from "$lib/speech/speech_text";
import type { Text } from "@prisma/client";
import type { TextId } from "./text_id";
import type { TextLimit } from "./text_limit";

export interface TextRepository {
	find(text_id: TextId): Promise<Text | null>
	find_many(speech_language_code: SpeechLanguageCode, limit?: TextLimit): Promise<Text[]>
	find_unique(text_id: TextId): Promise<Text | null>
	upsert(speech_language_code: SpeechLanguageCode, speech_text: SpeechText): Promise<Text>
	delete(text_id: TextId): Promise<Text>
}