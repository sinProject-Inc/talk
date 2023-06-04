import fs from 'fs'
import { AvatarFilePath } from './avatar_file_path'
import type { UserId } from '../user/user_id'
import type { AvatarExtension } from '@prisma/client'

export class Avatar {
	public constructor(private readonly _data: Uint8Array) {}

	public get data(): Uint8Array {
		return this._data
	}

	public static async from_user_id(user_id: UserId, extension: AvatarExtension): Promise<Avatar> {
		const avatar_file_path = AvatarFilePath.from_user_id(user_id, extension)
		const avatar = Avatar.from_avatar_path(avatar_file_path)

		return avatar
	}

	public static async from_avatar_path(avatar_file_path: AvatarFilePath): Promise<Avatar> {
		let avatar_file_buffer: Buffer

		try {
			avatar_file_buffer = await fs.promises.readFile(avatar_file_path.path)
		} catch (e) {
			const default_avatar_path = 'src/lib/assets/default_avatar.png'

			avatar_file_buffer = await fs.promises.readFile(default_avatar_path)
		}

		const avatar_file_unit8_array = new Uint8Array(avatar_file_buffer)
		const avatar = new Avatar(avatar_file_unit8_array)

		return avatar
	}
}
