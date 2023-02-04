<script lang="ts">
	import { browser } from '$app/environment'
	import Navbar from '$lib/components/navbar.svelte'
	import SwapIcon from '$lib/components/icons/swap_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import TranslateBox from '$lib/components/translate/translate_box.svelte'
	import { LocaleCode } from '$lib/language/locale_code'
	import { Html } from '$lib/view/html'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Locale, Text } from '@prisma/client'
	import { onMount } from 'svelte'
	import { TextsApi } from '$lib/text/texts_api'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'

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

	let text_history: Text[] = []
	let selected_text: Text | undefined

	$: listening = top_listening || bottom_listening

	function init_locale_select(): void {
		const locales = JSON.parse(data.locales) as Locale[]

		Html.append_language_select_options(top_locale_select_element, locales)
		Html.append_language_select_options(bottom_locale_select_element, locales)

		fetch_history()
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

	async function on_message(
		event: CustomEvent,
		sender: TranslateBox,
		recipient?: TranslateBox
	): Promise<void> {
		if (!recipient) return

		if (event.detail.text) {
			recipient.show_translation(event.detail.text, true)
		}

		if (event.detail.clear) {
			recipient.clear()
		}

		if (event.detail.fetch_history) {
			await fetch_history()
			await top_translate_box.text_to_speech()
		}
	}

	function switch_locales(): void {
		const top_locale = top_locale_select_element.value
		const bottom_locale = bottom_locale_select_element.value

		top_locale_select_element.value = bottom_locale
		bottom_locale_select_element.value = top_locale

		const top_text = top_translate_box.get_text()
		const bottom_text = bottom_translate_box.get_text()

		top_translate_box.set_text(bottom_text)
		bottom_translate_box.set_text(top_text)

		on_change_locale_select()
	}

	async function fetch_history(): Promise<void> {
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(top_locale_code)
		
		text_history = await new TextsApi(speech_language_code, 10).fetch()
	}

	onMount(async () => {
		if (!browser) return

		init_locale_select()
		on_change_locale_select(false)
	})

	async function on_click_text(text: Text): Promise<void> {
		await top_translate_box.add_text(text.text)
		await bottom_translate_box.show_translation(text)
	}

	function is_element_last<T>(array: Array<T>, element: T): boolean {
		const is_last = array[array.length - 1] === element

		return is_last
	}
</script>

<svelte:head>
	<title>Talk - Translate</title>
</svelte:head>

<Navbar />
<div class="center-container py-4 h-[calc(100vh-117px)] w-screen ">
	<div class="flex justify-evenly mb-4 items-center glass-panel gap-4">
		<select
			class="outline-0 bg-transparent p-2 text-center hover:scale-110 transition-all duration-300 appearance-none text-ellipsis"
			name="language_1"
			id="language_1"
			bind:this={top_locale_select_element}
			on:change={() => on_change_locale_select()}
		/>
		<IconButton on_click_handler={switch_locales}><SwapIcon /></IconButton>
		<select
			class="outline-0 bg-transparent p-2 text-center hover:scale-110 transition-all duration-300 appearance-none text-ellipsis"
			name="language_2"
			id="language_2"
			bind:this={bottom_locale_select_element}
			on:change={() => on_change_locale_select()}
		/>
	</div>
	<div class="flex flex-col gap-4 h-full">
		<TranslateBox
			locale_select_element={top_locale_select_element}
			speech_text_element={from_language_text_element}
			bind:this={top_translate_box}
			bind:audio_element
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
			bind:audio_element
			bind:locale_code={bottom_locale_code}
			bind:listening={bottom_listening}
			bind:either_listening={listening}
			on:message={(event) => {
				on_message(event, bottom_translate_box, top_translate_box)
			}}
		/>
		<div class="main-box history-box glass-panel h-[calc((100vh-190px)/3)] flex flex-col {text_history.length > 0 ? 'visible' : 'invisible' }">
			<h2 class="title px-5 py-2">History</h2>
			<div class="overflow-auto">
				{#each text_history as text, i}
					<div
						class="text py-[10px] cursor-pointer transition px-5 hover:bg-white/10 {selected_text ==
						text
							? 'bg-white/10'
							: 'bg-inherit'} {is_element_last(text_history, text) ? 'rounded-b-md' : ''}"
						id={text.id.toString()}
						on:click={() => on_click_text(text)}
						on:keydown
					>
						{text.text}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<audio class="hidden" controls bind:this={audio_element} />