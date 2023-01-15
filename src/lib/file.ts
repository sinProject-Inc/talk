import { SOUND_DIR } from '$env/static/private'
import fs from 'fs'
import type { SoundId } from './value/value_object/number_value_object/sound_id'
import { SpeechSound } from './value/value_object/string_value_object/speech_sound'

export class File {
	private static _get_sound_file_path(sound_id: SoundId): string {
		return `${SOUND_DIR}${sound_id}.mp3`
	}

	public static read_sound(sound_id: SoundId): SpeechSound {
		const sound_file_path = this._get_sound_file_path(sound_id)
		const sound_file_buffer = fs.readFileSync(sound_file_path)
		const sound_file_unit8_array = new Uint8Array(sound_file_buffer)
		const speech_sound = new SpeechSound(sound_file_unit8_array)

		return speech_sound
	}

	public static write_sound(sound_id: SoundId, speech_sound: SpeechSound): void {
		const sound_file_path = this._get_sound_file_path(sound_id)
		fs.writeFileSync(sound_file_path, speech_sound.value, 'binary')
	}
}
