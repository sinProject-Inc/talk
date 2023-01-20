import type { SpeechSound } from "./sound/speech_sound";

export interface Speech {
	speak(): Promise<SpeechSound>
}
