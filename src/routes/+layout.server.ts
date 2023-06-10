import { Repository } from '$lib/app/repository'
import { SettingKey } from '$lib/app/setting_key'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
	const background_period_duration =
		(await Repository.app_setting.get_number(SettingKey.background_period_sec)) * 1000

	const background_transition_duration =
		(await Repository.app_setting.get_number(SettingKey.background_transition_sec)) * 1000

	return {
		user: locals.user,
		background_period_duration,
		background_transition_duration,
	}
}
