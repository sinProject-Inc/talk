import type { Sound } from "@prisma/client"

export interface SoundRepository {
	upsert(): Promise<Sound>
	find_first(): Promise<Sound | null>
}