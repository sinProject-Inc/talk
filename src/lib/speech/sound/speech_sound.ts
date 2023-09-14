import fs from 'fs'
import type { SoundId } from '$lib/speech/sound/sound_id'
import { SoundFilePath } from './sound_file_path'

export class SpeechSound {
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

	public static async read(sound_id: SoundId): Promise<SpeechSound> {
		const sound_file_path = SoundFilePath.from_id(sound_id)
		const sound_file_buffer = await fs.promises.readFile(sound_file_path.path)
		const sound_file_unit8_array = new Uint8Array(sound_file_buffer)
		const speech_sound = new SpeechSound(sound_file_unit8_array)

		return speech_sound
	}

	public async write(sound_id: SoundId): Promise<void> {
		const sound_file_path = SoundFilePath.from_id(sound_id)

		await fs.promises.writeFile(sound_file_path.path, this._data, 'binary')
	}
}
