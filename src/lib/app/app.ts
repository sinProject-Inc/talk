import { PrismaClient } from "@prisma/client";

export class App {
	public static db = new PrismaClient()
}