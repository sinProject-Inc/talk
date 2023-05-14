import fs from 'fs'
import { Repository } from '$lib/app/repository'
import type { Email } from '$lib/auth/email'
import { AvatarFilePath } from './avatar_file_path'

export class Avatar {
	public constructor(private readonly _data: Uint8Array) {}

	public get data(): Uint8Array {
		return this._data
	}

	public static async read(email: Email): Promise<Avatar> {
		const user = await Repository.user.find_unique(email)

		if (!user) throw new Error('user is null')

		const avatar_file_path = AvatarFilePath.from_user_id(user.id)
		const avatar_file_buffer = await fs.promises.readFile(avatar_file_path.path)
		const avatar_file_unit8_array = new Uint8Array(avatar_file_buffer)
		const avatar = new Avatar(avatar_file_unit8_array)

		return avatar
	}
}
