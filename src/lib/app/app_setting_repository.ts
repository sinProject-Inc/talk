import type { SettingKey } from './setting_key'

export interface AppSettingRepository {
	get_number(setting_key: SettingKey): Promise<number>
}
