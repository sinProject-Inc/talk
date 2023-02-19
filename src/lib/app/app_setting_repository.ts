export interface AppSettingRepository {
	get_number(key: string): Promise<number>
}