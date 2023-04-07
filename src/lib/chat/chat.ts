export type ChatMemberEntity = {
	room_id: string
	name: string
	locale_code: string
	is_mobile_device: boolean
}

export type MessageSet = {
	locale_code: string
	name: string
	message: string
}
