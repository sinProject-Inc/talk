<script lang="ts">
	import { browser } from '$app/environment'
	import Header from '$lib/components/header.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import TranslateBox from '$lib/components/translate/translate_box.svelte'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { Html } from '$lib/view/html'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Language } from '@prisma/client'
	import { onMount, SvelteComponent } from 'svelte'

	export let data: PageData

	let from_language_select_element: HTMLSelectElement
	let to_language_select_element: HTMLSelectElement

	let from_language_text_element: HTMLTextAreaElement
	let to_language_text_element: HTMLTextAreaElement

	let from_language_text: string
	let to_language_text: string

	let lastEdited: number = Date.now()

	let from: SvelteComponent
	let to: SvelteComponent

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

		Html.append_language_select_options(from_language_select_element, languages)
		Html.append_language_select_options(to_language_select_element, languages)
	}

	async function select_default_language(): Promise<void> {
		const language_from = localStorage.getItem('language_from')
		if (language_from) from_language_select_element.value = language_from

		const language_to = localStorage.getItem('language_to')
		if (language_to) to_language_select_element.value = language_to
	}

	function stupid_function(value: string) {
		to.weird_function()
	}

	function handleMessage(event) {
		console.log(event)
		to.set_text(event.detail.text)
	}
</script>

<Header />
<div class="center-container my-8">
	<div class="flex justify-evenly mb-4 items-center glass-panel gap-4">
		<select
			bind:this={from_language_select_element}
			class="rounded-r-none outline-0 bg-transparent rounded-l-md p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			name="language_1"
			id="language_1"
		/>
		<IconButton>⇆</IconButton>
		<select
			bind:this={to_language_select_element}
			class="rounded-l-none outline-0 bg-transparent rounded-r-md p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
			name="language_2"
			id="language_2"
		/>
	</div>
	<div class="flex flex-col gap-10">
		<TranslateBox
			on:message={handleMessage}
			bind:this={from}
			text={from_language_text}
			{onTextChange}
			locale_select_element={from_language_select_element}
			partner_text={to_language_text}
			partner={to_language_text_element}
			speech_text_element={from_language_text_element}
		/>
		<TranslateBox
			bind:this={to}
			text={to_language_text}
			{onTextChange}
			locale_select_element={to_language_select_element}
			partner_text={from_language_text}
			partner={from_language_text_element}
			speech_text_element={to_language_text_element}
			play
		/>
	</div>
</div>
