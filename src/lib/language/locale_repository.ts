import type { Locale } from "@prisma/client";

export interface LocaleRepository {
	find_many(): Promise<Locale[]>
}