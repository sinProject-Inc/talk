<script lang="ts">
	import { browser } from '$app/environment'
	import Header from '$lib/components/header.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import TranslateBox from '$lib/components/translate/translate_box.svelte'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { Html } from '$lib/view/html'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Language, Locale } from '@prisma/client'
	import { onMount, SvelteComponent } from 'svelte'

	export let data: PageData

	let top_language_select_element: HTMLSelectElement
	let bottom_language_select_element: HTMLSelectElement

	let top_locale_select_element: HTMLSelectElement
	let bottom_locale_select_element: HTMLSelectElement

	let from_language_text_element: HTMLTextAreaElement
	let to_language_text_element: HTMLTextAreaElement

	let from_language_text: string
	let to_language_text: string

	let lastEdited: number = Date.now()

	let from: SvelteComponent
	let to: SvelteComponent

	let top_body: string
	let bottom_body: string

	function onTextChange() {
		const currentTime = Date.now()
		if (currentTime - lastEdited >= 1000) {
			console.log('hellooo')
			lastEdited = currentTime
		}
	}

	onMount(async () => {
		if (!browser) return

		init_language_select()
		// from_language_select.onchange = on_change_language_select_for_texts
		// on_change_from_language_select()
		await select_default_language()
	})

	function init_language_select(): void {
		const languages = JSON.parse(data.languages) as Language[]

		Html.append_language_select_options(top_language_select_element, languages)
		Html.append_language_select_options(bottom_language_select_element, languages)
	}

	async function select_default_language(): Promise<void> {
		const language_top = localStorage.getItem('language_top')
		if (language_top) top_language_select_element.value = language_top

		const language_bottom = localStorage.getItem('language_bottom')
		if (language_bottom) bottom_language_select_element.value = language_bottom
	}
</script>

<Header />
<div class="center-container my-4">
	<div class="flex justify-evenly mb-4 items-center glass-panel gap-4">
		<select
			bind:this={top_language_select_element}
			class="rounded-r-none outline-0 bg-transparent rounded-l-md p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			name="language_1"
			id="language_1"
		/>
		<select
			class="outline-0 bg-transparent p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			bind:this={top_locale_select_element}
		>
			<option value="volvo">(Volvo)</option></select
		>
		<IconButton>⇆</IconButton>
		<select
			bind:this={bottom_language_select_element}
			class="outline-0 bg-transparent p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			name="language_2"
			id="language_2"
		/>
		<select
			class="rounded-r-none outline-0 bg-transparent rounded-l-md p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			bind:this={bottom_locale_select_element}
		>
			<option value="volvo">(Volvo)</option></select
		>
	</div>
	<div class="flex flex-col gap-4">
		<TranslateBox
			on:message={(event) => (bottom_body = event.detail.translated_body)}
			bind:this={from}
			bind:body={top_body}
			{data}
			{onTextChange}
			language_select_element={top_language_select_element}
			locale_select_element={top_locale_select_element}
			partner_text={to_language_text}
			partner={to_language_text_element}
			speech_text_element={from_language_text_element}
		/>
		<TranslateBox
			on:message={(event) => (top_body = event.detail.translated_body)}
			bind:body={bottom_body}
			{data}
			{onTextChange}
			language_select_element={bottom_language_select_element}
			locale_select_element={bottom_locale_select_element}
			partner_text={from_language_text}
			partner={from_language_text_element}
			speech_text_element={to_language_text_element}
			play
		/>
	</div>
</div>
