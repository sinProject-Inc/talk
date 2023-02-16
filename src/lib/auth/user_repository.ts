import type { User } from "@prisma/client"

export interface UserRepository {
	find_unique(can_register?: boolean): Promise<User | undefined>
}