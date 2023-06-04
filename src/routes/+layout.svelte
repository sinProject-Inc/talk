<script lang="ts">
	import { navigating } from '$app/stores'
	import '$lib/app.css'
	import { Direction } from '$lib/view/direction'
	import NProgress from 'nprogress'
	import 'nprogress/nprogress.css'
	import { locale } from 'svelte-i18n'
	import type { LayoutServerData } from './$types'
	import { Background } from '$lib/background/background'
	import { browser } from '$app/environment'
	import { afterNavigate } from '$app/navigation'
	import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill'
	import { theme_service } from '$lib/theme/theme_service'
	import { Theme } from '@prisma/client'
	import { onMount } from 'svelte'
	import type { Unsubscriber } from 'svelte/store'

	export let data: LayoutServerData

	const background_period_duration = data.background_period_duration
	const background_transition_duration = data.background_transition_duration
	let current_background: Background
	let next_background: Background
	let transitioning_background = false
	let transition_background_timer: number

	let current_theme: Theme

	const background_dark_overlay = 'rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)'
	const background_light_overlay = 'rgba(241,245,249, 0.9), rgba(241,245,249, 0.9)'

	let unsubscribe_to_theme: Unsubscriber

	load_backgrounds()
	polyfillCountryFlagEmojis()

	function get_direction(locale_code: string): string {
		return new Direction(locale_code).value
	}

	NProgress.configure({ showSpinner: false })

	$: {
		if ($navigating) {
			NProgress.start()
		} else {
			NProgress.done()
		}
	}

	async function transition_background(): Promise<void> {
		if (transitioning_background) return

		transitioning_background = true

		await new Promise((resolve) => setTimeout(resolve, background_transition_duration))
		current_background = current_background.transition_background()

		transitioning_background = false

		next_background = next_background.transition_background()
	}

	function load_backgrounds(): void {
		if (!browser) return

		current_background = Background.from_local_storage()
		next_background = current_background.get_next_background()
	}

	function execute_transition(): void {
		clearInterval(transition_background_timer)

		current_background.transition_background()
		next_background = current_background.get_next_background()

		transition_background()

		transition_background_timer = window.setInterval(() => {
			transition_background()
		}, background_period_duration)
	}

	async function subscribe_to_theme(): Promise<void> {
		unsubscribe_to_theme = await theme_service.subscribe((theme) => {
			current_theme = theme
		})
	}

	onMount(async () => {
		await theme_service.init_store(data.theme)

		await subscribe_to_theme()
	})

	afterNavigate(() => {
		execute_transition()
	})
</script>

{#if current_theme}
	<div class={current_theme}>
		<div
			class="min-h-screen bg-cover bg-fixed bg-no-repeat font-sans"
			dir={get_direction($locale ?? '')}
		>
			<div>
				{#if current_background}
					<div class="fixed -z-50 h-screen w-full">
						<div
							style="background: linear-gradient({current_theme === Theme.dark
								? background_dark_overlay
								: background_light_overlay}), url({next_background.background_url}) bottom center/cover"
							class="pointer-events-none absolute h-full min-h-screen w-full bg-cover bg-fixed bg-no-repeat"
							aria-hidden="true"
						/>
						<div
							class="{transitioning_background
								? 'opacity-0 transition-all'
								: 'opactiy-100'}  pointer-events-none absolute h-full min-h-screen w-full bg-cover bg-fixed bg-no-repeat"
							style="background: linear-gradient({current_theme === Theme.dark
								? background_dark_overlay
								: background_light_overlay}), url({current_background.background_url}) bottom center/cover; transition-duration: {transitioning_background
								? background_transition_duration
								: 0}ms"
							aria-hidden="true"
						/>
					</div>
				{/if}
			</div>
			<slot />
		</div>
	</div>
{/if}
<svelte:window on:unload={unsubscribe_to_theme} />
