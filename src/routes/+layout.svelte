<script lang="ts">
	import { navigating, page } from '$app/stores'
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
	import { theme_store } from '$lib/theme/theme_service'
	import type { Theme } from '@prisma/client'

	export let data: LayoutServerData

	const background_period_duration = data.background_period_duration
	const background_transition_duration = data.background_transition_duration
	let current_background: Background
	let next_background: Background
	let transitioning_background = false
	let transition_background_timer: number

	let theme_class: Theme = data.theme

	const unsubscribe_to_theme = theme_store.subscribe((theme) => {
		theme_class = theme
	})

	theme_class = data.theme

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

	afterNavigate(() => {
		execute_transition()
	})
</script>

{#if theme_class}
	<div class={theme_class}>
		<div
			class="min-h-screen bg-green-500 bg-cover bg-fixed bg-no-repeat font-sans dark:bg-red-500"
			dir={get_direction($locale ?? '')}
		>
			<div>
				{#if current_background}
					<div class="fixed -z-50 h-screen w-full">
						<div
							style="background: linear-gradient(rgba(15, 23, 43, 0.9), rgba(15, 23, 43, 0.9)), url({next_background.background_url}) bottom center/cover"
							class="pointer-events-none absolute h-full min-h-screen w-full bg-cover bg-fixed bg-no-repeat"
							aria-hidden="true"
						/>
						<div
							class="{transitioning_background
								? 'opacity-0 transition-all'
								: 'opactiy-100'}  pointer-events-none absolute h-full min-h-screen w-full bg-cover bg-fixed bg-no-repeat"
							style=" background: linear-gradient(rgba(15, 23, 43, 0.9), rgba(15, 23, 43, 0.9)), url({current_background.background_url}) bottom center/cover; transition-duration: {transitioning_background
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
