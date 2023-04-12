import type { LayoutServerLoad } from './$types'
import { Background } from '$lib/background/background'
import { Repository } from '$lib/app/repository'
import { SettingKey } from '$lib/app/setting_key'

export const load: LayoutServerLoad = async ({ locals, cookies, fetch }) => {
	const background_period_duration =
		(await Repository.app_setting.get_number(SettingKey.background_period_sec)) * 1000

	const background_transition_duration =
		(await Repository.app_setting.get_number(SettingKey.background_transition_sec)) * 1000

	const background = Background.from_cookies(cookies, fetch)
	const background_index = background.background_index

	return {
		user: locals.user,
		background_index: background_index.index,
		background_period_duration,
		background_transition_duration,
	}
}
