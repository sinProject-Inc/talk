import type { Theme, User, AvatarExtension } from '@prisma/client'
import type { Email } from './email'

export interface UserRepository {
	find_unique(email: Email, can_register?: boolean): Promise<User | undefined>
	update_theme(user: User, theme: string): Promise<Theme | undefined>
	update_avatar_extension(user: User, extension: AvatarExtension): Promise<string | undefined>
}
