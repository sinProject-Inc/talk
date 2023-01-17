import { SOUND_DIR } from '$env/static/private'
import fs from 'fs'
import type { SoundId } from './value/value_object/number_value_object/sound_id'
import { SpeechSound } from './value/value_object/string_value_object/speech_sound'
import { SoundFilePath } from './value/value_object/string_value_object/text_value_object/file_path'

export class File {
	private static _get_sound_file_path(sound_id: SoundId): SoundFilePath {
		const file_path = new SoundFilePath(`${SOUND_DIR}${sound_id}.mp3`)

		return file_path
	}

	public static read_sound(sound_id: SoundId): SpeechSound {
		const sound_file_path = this._get_sound_file_path(sound_id)
		const sound_file_buffer = fs.readFileSync(sound_file_path.string)
		const sound_file_unit8_array = new Uint8Array(sound_file_buffer)
		const speech_sound = new SpeechSound(sound_file_unit8_array)

		return speech_sound
	}

	public static write_sound(sound_id: SoundId, speech_sound: SpeechSound): void {
		const sound_file_path = this._get_sound_file_path(sound_id)
		fs.writeFileSync(sound_file_path.string, speech_sound.unit8_array, 'binary')
	}
}
