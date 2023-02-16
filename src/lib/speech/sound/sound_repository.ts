import type { Sound } from "@prisma/client"

export interface SoundRepository {
	save(): Promise<Sound>
	find_first(): Promise<Sound | null>
}