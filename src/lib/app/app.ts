import { PrismaClient } from '@prisma/client'

export class App {
	public static prisma_client = new PrismaClient()
	public static localhost_origin = 'http://localhost:5173'
}
