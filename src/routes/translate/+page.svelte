<script lang="ts">
	import { browser } from '$app/environment'
	import Navbar from '$lib/components/navbar.svelte'
	import SwapIcon from '$lib/components/icons/swap_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import TranslateBox from '$lib/components/translate/translate_box.svelte'
	import { LocaleCode } from '$lib/language/locale_code'
	import { Html } from '$lib/view/html'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Locale } from '@prisma/client'
	import { onMount } from 'svelte'

	export let data: PageData

	let top_locale_select_element: HTMLSelectElement
	let bottom_locale_select_element: HTMLSelectElement

	let from_language_text_element: HTMLTextAreaElement
	let to_language_text_element: HTMLTextAreaElement

	let top_locale_code = LocaleCode.english_united_states
	let bottom_locale_code = LocaleCode.japanese_japan

	let top_translate_box: TranslateBox
	let bottom_translate_box: TranslateBox

	let audio_element: HTMLAudioElement

	let top_listening = false
	let bottom_listening = false

	$: listening = top_listening || bottom_listening

	function init_locale_select(): void {
		const locales = JSON.parse(data.locales) as Locale[]

		Html.append_language_select_options(top_locale_select_element, locales)
		Html.append_language_select_options(bottom_locale_select_element, locales)
	}

	function on_change_locale_select(store_locale = true): void {
		if (!store_locale) {
			const top_locale = localStorage.getItem('translate_top_locale')
			const bottom_locale = localStorage.getItem('translate_bottom_locale')

			if (top_locale) top_locale_select_element.value = top_locale
			if (bottom_locale) bottom_locale_select_element.value = bottom_locale
		}

		const top_selected_value = top_locale_select_element.selectedOptions[0].value
		const bottom_selected_value = bottom_locale_select_element.selectedOptions[0].value

		top_locale_code = LocaleCode.create(top_selected_value)
		bottom_locale_code = LocaleCode.create(bottom_selected_value)

		if (store_locale) {
			localStorage.setItem('translate_top_locale', top_locale_code.code)
			localStorage.setItem('translate_bottom_locale', bottom_locale_code.code)
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function on_message(event: any, sender: TranslateBox, recipient?: TranslateBox): void {
		if (!recipient) return

		if (event.detail.body) {
			recipient.show_translation(event.detail.body, event.detail.text_id, true)
		} 
		
		if (event.detail.clear) {
			recipient.clear()
		}
	}

	function switch_locales(): void {
		const top_locale = top_locale_select_element.value
		const bottom_locale = bottom_locale_select_element.value

		top_locale_select_element.value = bottom_locale
		bottom_locale_select_element.value = top_locale

		const top_text = top_translate_box.get_body_text()
		const bottom_text = bottom_translate_box.get_body_text()

		top_translate_box.set_body_text(bottom_text)
		bottom_translate_box.set_body_text(top_text)

		on_change_locale_select()
	}

	onMount(async () => {
		if (!browser) return

		init_locale_select()
		on_change_locale_select(false)
	})
</script>

<svelte:head>
	<title>Talk - Translate</title>
</svelte:head>

<Navbar />
<div class="center-container my-4">
	<div class="flex justify-evenly mb-4 items-center glass-panel gap-4">
		<select
			class="rounded-r-none outline-0 bg-transparent rounded-l-md p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			name="language_1"
			id="language_1"
			bind:this={top_locale_select_element}
			on:change={() => on_change_locale_select()}
		/>
		<IconButton on_click_handler={switch_locales}><SwapIcon /></IconButton>
		<select
			class="outline-0 bg-transparent p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			name="language_2"
			id="language_2"
			bind:this={bottom_locale_select_element}
			on:change={() => on_change_locale_select()}
		/>
	</div>
	<div class="flex flex-col gap-4">
		<TranslateBox
			locale_select_element={top_locale_select_element}
			speech_text_element={from_language_text_element}
			bind:this={top_translate_box}
			bind:audio_element={audio_element}
			bind:locale_code={top_locale_code}
			bind:listening={top_listening}
			bind:either_listening={listening}
			on:message={(event) => {
				on_message(event, top_translate_box, bottom_translate_box)
			}}
		/>
		<TranslateBox
			locale_select_element={bottom_locale_select_element}
			speech_text_element={to_language_text_element}
			
			bind:this={bottom_translate_box}
			bind:audio_element={audio_element}
			bind:locale_code={bottom_locale_code}
			bind:listening={bottom_listening}
			bind:either_listening={listening}
			on:message={(event) => {
				on_message(event, bottom_translate_box, top_translate_box)
			}}
		/>
	</div>
</div>

<audio class="hidden" controls bind:this={audio_element} />