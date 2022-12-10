import { SOUND_DIR } from '$env/static/private'
import fs from 'fs'

export class File {
	private static _get_sound_file_path(sound_id: number): string {
		return `${SOUND_DIR}${sound_id}.mp3`
	}

	public static read_sound(sound_id: number): Buffer {
		const sound_file_path = this._get_sound_file_path(sound_id)
		const sound_file_buffer = fs.readFileSync(sound_file_path)

		return sound_file_buffer
	}

	public static write_sound(sound_id: number, sound_file_buffer: Buffer): void {
		const sound_file_path = this._get_sound_file_path(sound_id)
		fs.writeFileSync(sound_file_path, sound_file_buffer, 'binary')
	}
}
