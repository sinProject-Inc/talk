import type { AuthPin, AuthToken, Role, User } from "@prisma/client";
import type { LifeTime } from "./life_time";
import type { Session } from "./session";

export interface AuthTokenRepository {
	find(session: Session): Promise<
		| (AuthToken & {
				user: User & {
					role: Role
				}
		  })
		| null
	>

	create(auth_pin: AuthPin): Promise<[AuthToken, LifeTime]>
	update(auth_token: AuthToken): Promise<[AuthToken, LifeTime]>
	delete(session: Session): Promise<void>
}