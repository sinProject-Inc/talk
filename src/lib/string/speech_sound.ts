import fs from 'fs'
import type { SoundId } from '$lib/number/valid_id/sound_id'
import { SoundFilePath } from './valid_text/sound_file_path'

export class SpeechSound {
	private readonly _speech_sound: undefined

	public constructor(private readonly _data: Uint8Array) {}

	public get data(): Uint8Array {
		return this._data
	}

	public get length(): number {
		return this._data.length
	}

	public get length_string(): string {
		return this.length.toString()
	}

	public static read(sound_id: SoundId): SpeechSound {
		const sound_file_path = SoundFilePath.from_id(sound_id)
		const sound_file_buffer = fs.readFileSync(sound_file_path.path)
		const sound_file_unit8_array = new Uint8Array(sound_file_buffer)
		const speech_sound = new SpeechSound(sound_file_unit8_array)

		return speech_sound
	}

	public write(sound_id: SoundId): void {
		const sound_file_path = SoundFilePath.from_id(sound_id)
		fs.writeFileSync(sound_file_path.path, this._data, 'binary')
	}
}
