import { PrismaClient } from '@prisma/client'

type RoleSeed = {
	name: string
}

export class RoleSeeder {
	private static readonly _seeds: RoleSeed[] = [{ name: 'admin' }, { name: 'user' }]

	public constructor(private readonly _prisma_client: PrismaClient) {}

	public async execute(): Promise<void> {
		for (const seed of RoleSeeder._seeds) {
			const name = seed.name

			await this._prisma_client.role.upsert({
				where: { name },
				update: {},
				create: { name },
			})
		}
	}
}
