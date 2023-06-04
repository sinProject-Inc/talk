import type { LayoutServerLoad } from './$types'
import { Repository } from '$lib/app/repository'
import { SettingKey } from '$lib/app/setting_key'
import { Email } from '$lib/auth/email'

export const load: LayoutServerLoad = async ({ locals }) => {
	const background_period_duration =
		(await Repository.app_setting.get_number(SettingKey.background_period_sec)) * 1000

	const background_transition_duration =
		(await Repository.app_setting.get_number(SettingKey.background_transition_sec)) * 1000

	const email = new Email(locals.user.email)
	const user = await Repository.user.find_unique(email)

	if (!user) throw new Error('user is null')

	const theme = user.theme

	return {
		user: locals.user,
		background_period_duration,
		background_transition_duration,
		theme,
	}
}
