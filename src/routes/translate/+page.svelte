<script lang="ts">
	import { browser } from '$app/environment'
	import ConfirmDeleteModal from '$lib/components/confirm_delete_modal.svelte'
	import SwapIcon from '$lib/components/icons/swap_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import Navbar from '$lib/components/navbar.svelte'
	import Snackbar from '$lib/components/snackbar.svelte'
	import TextListText from '$lib/components/text_list_text.svelte'
	import TranslateBox from '$lib/components/translate/translate_box.svelte'
	import { TextError } from '$lib/general/text_error'
	import { DefaultLocales } from '$lib/locale/default_locales'
	import { LocaleCode } from '$lib/locale/locale_code'
	import { SpeechText } from '$lib/speech/speech_text'
	import { SpeechTextAreaElement } from '$lib/speech/speech_text_area_element'
	import { SubmissionText } from '$lib/speech/submission_text'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { WebSpeechRecognition } from '$lib/speech/web_speech_recognition'
	import { DeleteTextApi } from '$lib/text/delete_text_api'
	import { TextsApi } from '$lib/text/texts_api'
	import { GetTranslationApi } from '$lib/translation/get_translation_api'
	import { Direction } from '$lib/view/direction'
	import { LocaleSelectElement } from '$lib/view/locale_select_element'
	import { WebLogger } from '$lib/view/log/web_logger'
	import { Message } from '$lib/view/message'
	import type { Locale, Text } from '@prisma/client'
	import { onMount } from 'svelte'
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import type { PageData } from './$types'

	export let data: PageData

	let source_locale_code = LocaleCode.japanese_japan
	let source_listening = false
	let source_locale_select_element: HTMLSelectElement
	let source_translate_box: TranslateBox

	let destination_locale_code = LocaleCode.english_united_states
	let destination_listening = false
	let destination_locale_select_element: HTMLSelectElement
	let destination_translate_box: TranslateBox

	let audio_element: HTMLAudioElement
	let web_speech_recognition: WebSpeechRecognition | undefined
	let history_texts: Text[] = []
	let copied_snackbar_timeout: number | undefined
	let copied_snackbar_visible = false

	let confirming_delete_text: Text | undefined

	const web_logger = new WebLogger('translate')

	$: listening = destination_listening || source_listening
	$: history_visible = history_texts.length > 0 ? 'visible' : 'invisible'

	function init_locale_select(): void {
		const locales = JSON.parse(data.locales) as Locale[]

		new LocaleSelectElement(destination_locale_select_element, locales).append_options_short()
		new LocaleSelectElement(source_locale_select_element, locales).append_options_short()
	}

	async function set_app_locale(): Promise<void> {
		$locale = destination_locale_code.code
		await waitLocale($locale)
	}

	async function fetch_history(): Promise<void> {
		history_texts = await new TextsApi(source_locale_code, 100).fetch()
	}

	function set_locale(): void {
		destination_locale_code = new LocaleCode(destination_locale_select_element.value)
		source_locale_code = new LocaleCode(source_locale_select_element.value)

		set_app_locale()
		fetch_history()
	}

	async function select_default_locales(): Promise<void> {
		const default_locales = new DefaultLocales(
			destination_locale_select_element,
			source_locale_select_element
		)

		default_locales.load_from_storage()
		set_locale()
	}

	function store_locale(): void {
		localStorage.setItem('from_locale', destination_locale_code.code)
		localStorage.setItem('to_locale', source_locale_code.code)
	}

	function switch_textarea_body(): void {
		const from_value = destination_translate_box.get_value()
		const to_value = source_translate_box.get_value()

		source_translate_box.set_value(from_value)
		destination_translate_box.set_value(to_value)
	}

	function switch_locales(): void {
		destination_locale_select_element.value = source_locale_code.code
		source_locale_select_element.value = destination_locale_code.code

		web_logger.info(
			`switch_locales: source: ${source_locale_select_element.value}, destination: ${destination_locale_select_element.value}`
		)

		switch_textarea_body()
		set_locale()
		store_locale()
	}

	function on_change_locale_select(target_select_element: HTMLSelectElement): void {
		web_logger.info(
			`on_change_locale_select: source: ${source_locale_select_element.value}, destination: ${destination_locale_select_element.value}`
		)

		if (destination_locale_select_element.value === source_locale_select_element.value) {
			switch_locales()
			return
		}

		target_select_element === destination_locale_select_element
			? destination_translate_box.clear()
			: source_translate_box.clear()

		set_locale()
		store_locale()
	}

	async function on_click_history_text(text: Text): Promise<void> {
		web_logger.info(
			`on_click_history_text: ${text.text}, locale: ${source_locale_select_element.value}`
		)

		source_translate_box.set_text(text)

		const submission_text = new SubmissionText(text.text)

		const translation_texts = await show_translation(
			submission_text,
			source_locale_code,
			destination_locale_code,
			destination_translate_box
		)

		speak_by_text(translation_texts, destination_locale_code)
	}

	async function delete_text(text?: Text): Promise<void> {
		if (!text) return

		await new DeleteTextApi(text).fetch()
		await fetch_history()
	}

	function set_translate_box_value(translate_box: TranslateBox, texts: Text[]): void {
		const translations = texts.map((translation_text) => translation_text.text)

		translate_box.set_value(translations.join('\n'))
	}

	async function show_translation(
		submission_text: SubmissionText,
		source_locale_code: LocaleCode,
		target_locale_code: LocaleCode,
		target_translate_box: TranslateBox
	): Promise<Text[]> {
		const speech_text = new SpeechText(submission_text.text)
		const translated_texts = await new GetTranslationApi(
			speech_text,
			source_locale_code,
			target_locale_code
		).fetch()

		set_translate_box_value(target_translate_box, translated_texts)

		return translated_texts
	}

	let text_to_speech_url = ''

	async function speak(value: string, locale_code: LocaleCode): Promise<void> {
		if (!value) return

		const new_text_to_speech_url = new TextToSpeechUrl(value, locale_code).url

		if (text_to_speech_url === new_text_to_speech_url) {
			audio_element.currentTime = 0
			try {
				await audio_element.play()
			} catch (error) {
				console.warn(error)
			}
		} else {
			text_to_speech_url = new_text_to_speech_url
		}
	}

	function speak_by_translate_box(translate_box: TranslateBox): void {
		const value = translate_box.get_value()
		const locale_code =
			translate_box === destination_translate_box ? destination_locale_code : source_locale_code

		web_logger.info(`speak: ${translate_box.get_value()}, locale: ${locale_code.code}`)

		speak(value, locale_code)
	}

	function speak_by_text(texts: Text[], locale_code: LocaleCode): void {
		if (texts.length === 0) return

		speak(texts[0].text, locale_code)
	}

	async function translate(translate_box: TranslateBox): Promise<void> {
		const value = translate_box.get_value()

		if (!value) return

		const this_locale_code =
			translate_box === source_translate_box ? source_locale_code : destination_locale_code
		const partner_locale_code =
			translate_box === destination_translate_box ? source_locale_code : destination_locale_code
		const partner_translate_box =
			translate_box === destination_translate_box ? source_translate_box : destination_translate_box

		web_logger.info(
			`translate: ${translate_box.get_value()}, from: ${this_locale_code.code}, to: ${
				partner_locale_code.code
			}`
		)

		try {
			const submission_text = new SubmissionText(value)
			const translation_texts = await show_translation(
				submission_text,
				this_locale_code,
				partner_locale_code,
				partner_translate_box
			)

			await fetch_history()
			speak_by_text(translation_texts, partner_locale_code)
		} catch (err) {
			if (err instanceof TextError) {
				const message = $_(err.message_id)
				partner_translate_box.set_value(message)
			} else {
				console.error(err)
			}
		}
	}

	function get_locale_select_element(translate_box: TranslateBox): HTMLSelectElement {
		return translate_box === destination_translate_box
			? destination_locale_select_element
			: source_locale_select_element
	}

	async function finish_listening(translate_box: TranslateBox): Promise<void> {
		const textarea_element = translate_box.get_textarea_element()

		textarea_element.placeholder = ''

		if (!textarea_element.value) return

		translate(translate_box)
	}

	function on_end_listening(translate_box: TranslateBox): void {
		if (translate_box === source_translate_box) {
			source_listening = false
		} else {
			destination_listening = false
		}

		finish_listening(translate_box)
	}

	function start_listening(translate_box: TranslateBox): void {
		if (audio_element.played) audio_element.pause()

		translate_box.clear()

		const locale_select_element = get_locale_select_element(translate_box)
		const locale_code = new LocaleCode(locale_select_element.value)
		const hint_message = new Message($_('recognizing'))
		const textarea_element = translate_box.get_textarea_element()
		const speech_text_area_element = new SpeechTextAreaElement(textarea_element, hint_message)

		web_logger.info(`start_listening: locale: ${locale_code.code}`)

		web_speech_recognition = new WebSpeechRecognition(locale_code, speech_text_area_element, () =>
			on_end_listening(translate_box)
		)

		web_speech_recognition.start_continuous()
	}

	function stop_listening(translate_box: TranslateBox): void {
		if (!web_speech_recognition) return

		web_speech_recognition.stop()

		finish_listening(translate_box)
	}

	async function on_copy(): Promise<void> {
		const text = await navigator.clipboard.readText()
		web_logger.info('on_copy: ' + text)

		if (copied_snackbar_timeout) clearTimeout(copied_snackbar_timeout)

		copied_snackbar_visible = true
		copied_snackbar_timeout = window.setTimeout(() => {
			copied_snackbar_visible = false
		}, 2000)
	}

	onMount(async () => {
		if (!browser) return

		web_logger.add_event_listeners()
		init_locale_select()
		await select_default_locales()
		source_translate_box.focus()
	})
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
			bind:this={source_locale_select_element}
			on:change={() => on_change_locale_select(source_locale_select_element)}
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
			bind:this={destination_locale_select_element}
			on:change={() => on_change_locale_select(destination_locale_select_element)}
		/>
	</div>
	<div class="grid grid-rows-3 h-[calc(100vh-141px)] gap-y-4">
		<div class="grid grid-rows-3 h-[calc(100vh-141px)] gap-y-4">
			<TranslateBox
				bind:this={source_translate_box}
				on:keydown_enter={() => translate(source_translate_box)}
				on:start_listening={() => start_listening(source_translate_box)}
				on:stop_listening={() => stop_listening(source_translate_box)}
				on:speak={() => speak_by_translate_box(source_translate_box)}
				on:copy={on_copy}
				locale_code={source_locale_code}
				partner_listening={destination_listening}
				bind:listening={source_listening}
			/>
			<TranslateBox
				bind:this={destination_translate_box}
				on:keydown_enter={() => translate(destination_translate_box)}
				on:start_listening={() => start_listening(destination_translate_box)}
				on:stop_listening={() => stop_listening(destination_translate_box)}
				on:speak={() => speak_by_translate_box(destination_translate_box)}
				on:copy={on_copy}
				locale_code={destination_locale_code}
				partner_listening={source_listening}
				bind:listening={destination_listening}
			/>
			<div class="main-box history-box glass-panel grow flex flex-col {history_visible}">
				<h2 class="title px-5 py-2">{$_('history')}</h2>
				<div class="overflow-auto" lang={source_locale_code.code}>
					{#each history_texts as text, i}
						<TextListText
							texts={history_texts}
							{text}
							{i}
							deletable
							on_click_text={() => on_click_history_text(text)}
							delete_text={() => (confirming_delete_text = text)}
							text_direction={new Direction(source_locale_code.code).value}
						/>
					{/each}
				</div>
			</div>
		</div>
	</div>
	<Snackbar text={$_('copied')} visible={copied_snackbar_visible} />
</div>

<audio class="mt-2 hidden" controls bind:this={audio_element} src={text_to_speech_url} autoplay />
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
