import type { SpeechSound } from "../string/speech_sound";

export interface Speech {
	speak(): Promise<SpeechSound>
}
