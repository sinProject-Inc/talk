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
	import { DeleteTextApi } from '$lib/text/delete_text_api'
	import TextListText from '$lib/components/text_list_text.svelte'
	import ConfirmDeleteModal from '$lib/components/confirm_delete_modal.svelte'

	export let data: PageData

	let from_locale_select_element: HTMLSelectElement
	let to_locale_select_element: HTMLSelectElement
	let from_language_text_element: HTMLTextAreaElement
	let to_language_text_element: HTMLTextAreaElement
	let audio_element: HTMLAudioElement

	let from_locale_code = LocaleCode.english_united_states
	let to_locale_code = LocaleCode.japanese_japan

	let from_translate_box: TranslateBox
	let to_translate_box: TranslateBox

	let from_listening = false
	let to_listening = false

	let text_history: Text[] = []
	let selected_text: Text | undefined

	let confirming_delete_text: Text | undefined

	$: listening = from_listening || to_listening

	function init_locale_select(): void {
		const locales = JSON.parse(data.locales) as Locale[]

		Html.append_language_select_options(from_locale_select_element, locales)
		Html.append_language_select_options(to_locale_select_element, locales)
	}

	async function select_default_locales(): Promise<void> {
		const language_from = localStorage.getItem('from_locale')
		from_locale_select_element.value = language_from ?? 'en-US'

		const language_to = localStorage.getItem('to_locale')
		to_locale_select_element.value = language_to ?? 'ja-JP'

		on_change_locale_select(false)
	}

	function on_change_locale_select(store_locale = true): void {
		if (!store_locale) {
			const from_locale = localStorage.getItem('from_locale')
			const to_locale = localStorage.getItem('to_locale')

			if (from_locale) from_locale_select_element.value = from_locale
			if (to_locale) to_locale_select_element.value = to_locale
		}

		const from_selected_value = from_locale_select_element.selectedOptions[0].value
		const to_selected_value = to_locale_select_element.selectedOptions[0].value

		from_locale_code = LocaleCode.create(from_selected_value)
		to_locale_code = LocaleCode.create(to_selected_value)

		if (store_locale) {
			localStorage.setItem('from_locale', from_locale_code.code)
			localStorage.setItem('to_locale', to_locale_code.code)
		}

		fetch_history()
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
		}
	}

	function switch_locales(): void {
		const from_locale = from_locale_select_element.value
		const to_locale = to_locale_select_element.value

		from_locale_select_element.value = to_locale
		to_locale_select_element.value = from_locale

		const from_text = from_translate_box.get_text()
		const to_text = to_translate_box.get_text()

		from_translate_box.set_text(to_text)
		to_translate_box.set_text(from_text)

		on_change_locale_select()
	}

	async function fetch_history(): Promise<void> {
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(from_locale_code)

		text_history = await new TextsApi(speech_language_code, 10).fetch()
	}

	onMount(async () => {
		if (!browser) return

		init_locale_select()

		await select_default_locales()
	})

	async function on_click_text(text: Text): Promise<void> {
		await from_translate_box.set_text(text)
		await to_translate_box.show_translation(text, true)
	}

	async function delete_text(text?: Text): Promise<void> {
		if (!text) return

		await new DeleteTextApi(text).fetch()

		await fetch_history()
	}
</script>

<svelte:head>
	<title>Talk - Translate</title>
</svelte:head>

<Navbar />
<div class="center-container w-screen h-[calc(100vh-69px)]">
	<div class="flex justify-evenly items-center glass-panel h-10 my-4">
		<select
			class="outline-0 bg-transparent p-2 text-center hover:scale-110 transition-all duration-300 appearance-none text-ellipsis"
			name="language_1"
			id="language_1"
			bind:this={from_locale_select_element}
			on:change={() => on_change_locale_select()}
		/>
		<div class="language-switcher">
			<IconButton on_click_handler={switch_locales}><SwapIcon /></IconButton>
		</div>
		<select
			class="outline-0 bg-transparent p-2 text-center hover:scale-110 transition-all duration-300 appearance-none text-ellipsis"
			name="language_2"
			id="language_2"
			bind:this={to_locale_select_element}
			on:change={() => on_change_locale_select()}
		/>
	</div>
	<div class="grid grid-rows-3 h-[calc(100vh-141px)] gap-y-4">
		<div class="grid grid-rows-3 h-[calc(100vh-141px)] gap-y-4">
			<TranslateBox
				locale_select_element={from_locale_select_element}
				speech_text_element={from_language_text_element}
				bind:this={from_translate_box}
				bind:audio_element
				bind:locale_code={from_locale_code}
				bind:listening={from_listening}
				bind:either_listening={listening}
				on:message={(event) => {
					on_message(event, from_translate_box, to_translate_box)
				}}
			/>
			<TranslateBox
				locale_select_element={to_locale_select_element}
				speech_text_element={to_language_text_element}
				bind:this={to_translate_box}
				bind:audio_element
				bind:locale_code={to_locale_code}
				bind:listening={to_listening}
				bind:either_listening={listening}
				on:message={(event) => {
					on_message(event, to_translate_box, from_translate_box)
				}}
			/>
			<div
				class="main-box history-box glass-panel grow flex flex-col {text_history.length > 0
					? 'visible'
					: 'invisible'}"
			>
				<h2 class="title px-5 py-2">History</h2>
				<div class="overflow-auto">
					{#each text_history as text, i}
						<TextListText
							texts={text_history}
							{text}
							{i}
							{selected_text}
							on_click_text={() => on_click_text(text)}
							delete_text={() => (confirming_delete_text = text)}
						/>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<audio class="hidden" controls autoplay bind:this={audio_element} />
{#if confirming_delete_text}
	<ConfirmDeleteModal
		on:close={() => {
			confirming_delete_text = undefined
		}}
		on:confirm_delete={() => {
			delete_text(confirming_delete_text)
		}}
	/>
{/if}
