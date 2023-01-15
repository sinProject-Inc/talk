import type { PreferNominal } from "$lib/value/value_object"
import { Id } from "./id"

export class SoundId extends Id {
	public sound_id!: PreferNominal
}