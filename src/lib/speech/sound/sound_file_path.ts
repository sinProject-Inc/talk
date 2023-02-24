import { SOUND_DIR } from '$env/static/private'
import type { SoundId } from '$lib/speech/sound/sound_id'
import { ValidText } from '../../text/valid_text'

export class SoundFilePath {
	private readonly _path: string

	private constructor(path: string) {
		const valid_text = new ValidText(path)

		this._path = valid_text.text
	}

	public get path(): string {
		return this._path
	}

	public static from_id(sound_id: SoundId): SoundFilePath {
		const sound_file_path = new SoundFilePath(`${SOUND_DIR}${sound_id.id}.mp3`)

		return sound_file_path
	}
}
