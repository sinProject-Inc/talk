import { SOUND_DIR } from '$env/static/private'
import fs from 'fs'
import type { SoundId } from '../number/valid_id/sound_id'
import { SpeechSound } from '../string/speech_sound'
import { SoundFilePath } from '../string/valid_text/sound_file_path'

export class File {
	private static _get_sound_file_path(sound_id: SoundId): SoundFilePath {
		const file_path = new SoundFilePath(`${SOUND_DIR}${sound_id.id}.mp3`)

		return file_path
	}

	public static read_sound(sound_id: SoundId): SpeechSound {
		const sound_file_path = this._get_sound_file_path(sound_id)
		const sound_file_buffer = fs.readFileSync(sound_file_path.path)
		const sound_file_unit8_array = new Uint8Array(sound_file_buffer)
		const speech_sound = new SpeechSound(sound_file_unit8_array)

		return speech_sound
	}

	public static write_sound(sound_id: SoundId, speech_sound: SpeechSound): void {
		const sound_file_path = this._get_sound_file_path(sound_id)
		fs.writeFileSync(sound_file_path.path, speech_sound.data, 'binary')
	}
}
