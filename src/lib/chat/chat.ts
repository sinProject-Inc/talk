export type ChatMemberEntity = {
	room_id: string
	name: string
	user_id: number
	locale_code: string
	is_mobile_device: boolean
}

export type MessageSet = {
	locale_code: string
	name: string
	sender_id: number
	message: string
}
