import type { ChatLog } from "@prisma/client";
import type { ChatEntity } from "./chat_entity";

export interface ChatLogRepository {
	find_many(): Promise<ChatLog[]>
	save(chat_entity: ChatEntity): Promise<ChatLog>
}