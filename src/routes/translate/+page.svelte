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
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import { onMount } from 'svelte'
	import { TextsApi } from '$lib/text/texts_api'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
	import { DeleteTextApi } from '$lib/text/delete_text_api'
	import TextListText from '$lib/components/text_list_text.svelte'
	import ConfirmDeleteModal from '$lib/components/confirm_delete_modal.svelte'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { LocaleSelectElement } from '$lib/view/locale_select_element'

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
	let playing_text: Text | undefined
	let playing_text_locale: LocaleCode | undefined

	$: from_locale_selected_value = from_locale_code.code
	$: to_locale_selected_value = to_locale_code.code
	$: listening = from_listening || to_listening

	function init_locale_select(): void {
		const locales = JSON.parse(data.locales) as Locale[]

		new LocaleSelectElement(from_locale_select_element, locales).append_options()
		new LocaleSelectElement(to_locale_select_element, locales).append_options()
	}

	async function select_default_locales(): Promise<void> {
		const language_from = localStorage.getItem('from_locale')
		from_locale_select_element.value = language_from ?? 'en-US'

		const language_to = localStorage.getItem('to_locale')
		to_locale_select_element.value = language_to ?? 'ja-JP'

		set_locale(false)
	}

	function on_change_locale_select(target_select_element: HTMLSelectElement): void {
		let partner_select_element: HTMLSelectElement
		let original_selected_value: string

		if (target_select_element === from_locale_select_element) {
			original_selected_value = from_locale_selected_value
			partner_select_element = to_locale_select_element
		} else {
			original_selected_value = to_locale_selected_value
			partner_select_element = from_locale_select_element
		}

		if (target_select_element.value === partner_select_element.value) {
			target_select_element.value = partner_select_element.value
			partner_select_element.value = original_selected_value
		}

		set_locale()
	}

	function set_locale(store_locale = true, keep_text = false): void {
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

		if (!keep_text) {
			from_translate_box.clear_self()
			to_translate_box.clear_self()
		}

		set_app_locale()
		fetch_history()
	}

	async function set_app_locale(): Promise<void> {
		const language_code = SpeechLanguageCode.create_from_locale_code(from_locale_code)

		const app_locale_code = AppLocaleCode.from_speech_language_code(language_code)
		$locale = app_locale_code.code

		await waitLocale($locale)
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
			recipient.clear_self()
		}

		if (event.detail.fetch_history) {
			await fetch_history()
		}

		if (event.detail.text_to_speech) {
			recipient.text_to_speech()
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

		set_locale(true, true)
	}

	async function fetch_history(): Promise<void> {
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(to_locale_code)

		text_history = await new TextsApi(speech_language_code, 100).fetch()
	}

	onMount(async () => {
		if (!browser) return

		init_locale_select()

		await select_default_locales()

		to_translate_box.focus()
	})

	async function on_click_text(text: Text): Promise<void> {
		await to_translate_box.set_text(text)
		await from_translate_box.show_translation(text, true)
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
	<div class="top-bar flex justify-evenly items-center glass-panel h-10 my-4">
		<select
			class="outline-0 bg-transparent p-2 text-center {listening
				? ''
				: 'hover:scale-110'} transition-all duration-300 appearance-none text-ellipsis"
			name="language_1"
			disabled={listening}
			id="language_1"
			bind:this={to_locale_select_element}
			on:change={() => on_change_locale_select(to_locale_select_element)}
		/>
		<div class="language-switcher">
			<IconButton
				enabled={!listening}
				on_click_handler={() => {
					if (!listening) switch_locales()
				}}><SwapIcon /></IconButton
			>
		</div>
		<select
			class="outline-0 bg-transparent p-2 text-center {listening
				? ''
				: 'hover:scale-110'} transition-all duration-300 appearance-none text-ellipsis"
			name="language_2"
			disabled={listening}
			id="language_2"
			bind:this={from_locale_select_element}
			on:change={() => on_change_locale_select(from_locale_select_element)}
		/>
	</div>
	<div class="grid grid-rows-3 h-[calc(100vh-141px)] gap-y-4">
		<div class="grid grid-rows-3 h-[calc(100vh-141px)] gap-y-4">
			<TranslateBox
				locale_select_element={to_locale_select_element}
				speech_text_element={to_language_text_element}
				bind:this={to_translate_box}
				bind:audio_element
				bind:locale_code={to_locale_code}
				bind:listening={to_listening}
				bind:partner_listening={from_listening}
				bind:playing_text
				bind:playing_text_locale
				on:message={(event) => {
					on_message(event, to_translate_box, from_translate_box)
				}}
			/>
			<TranslateBox
				locale_select_element={from_locale_select_element}
				speech_text_element={from_language_text_element}
				bind:this={from_translate_box}
				bind:audio_element
				bind:locale_code={from_locale_code}
				bind:listening={from_listening}
				bind:partner_listening={to_listening}
				bind:playing_text
				bind:playing_text_locale
				on:message={(event) => {
					on_message(event, from_translate_box, to_translate_box)
				}}
			/>
			<div
				class="main-box history-box glass-panel grow flex flex-col {text_history.length > 0
					? 'visible'
					: 'invisible'}"
			>
				<h2 class="title px-5 py-2">{$_('history')}</h2>
				<div class="overflow-auto">
					{#each text_history as text, i}
						<TextListText
							texts={text_history}
							{text}
							{i}
							{selected_text}
							deletable
							on_click_text={() => on_click_text(text)}
							delete_text={() => (confirming_delete_text = text)}
						/>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

{#if playing_text && playing_text_locale}
	<audio
		class="mt-2 hidden"
		controls
		bind:this={audio_element}
		src={new TextToSpeechUrl(playing_text, playing_text_locale).url}
		autoplay
	/>
{/if}
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
