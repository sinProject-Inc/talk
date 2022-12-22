import { SOUND_DIR } from '$env/static/private'
import fs from 'fs'

export class File {
	private static _get_sound_file_path(sound_id: number): string {
		return `${SOUND_DIR}${sound_id}.mp3`
	}

	public static read_sound(sound_id: number): Uint8Array {
		const sound_file_path = this._get_sound_file_path(sound_id)
		const sound_file_buffer = fs.readFileSync(sound_file_path)
		const sound_file_unit8array = new Uint8Array(sound_file_buffer)

		return sound_file_unit8array
	}

	public static write_sound(sound_id: number, sound_file_buffer: Uint8Array): void {
		const sound_file_path = this._get_sound_file_path(sound_id)
		fs.writeFileSync(sound_file_path, sound_file_buffer, 'binary')
	}
}
