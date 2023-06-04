<script lang="ts">
	import { browser } from '$app/environment'
	import Divider from '$lib/components/divider.svelte'
	import AddIcon from '$lib/components/icons/add_icon.svelte'
	import StopIcon from '$lib/components/icons/stop_icon.svelte'
	import TranslateIcon from '$lib/components/icons/language_hiragana_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import Navbar from '$lib/components/navbar.svelte'
	import TextListText from '$lib/components/text_list_text.svelte'
	import { DefaultLocales } from '$lib/locale/default_locales'
	import { LocaleCode } from '$lib/locale/locale_code'
	import { SpeechText } from '$lib/speech/speech_text'
	import { SpeechTextElement } from '$lib/speech/speech_text_element'
	import { SubmissionText } from '$lib/speech/submission_text'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { WebSpeechRecognition } from '$lib/speech/web_speech_recognition'
	import { AddTextApi } from '$lib/text/add_text_api'
	import { TextsApi } from '$lib/text/texts_api'
	import { TextId } from '$lib/text/text_id'
	import { AddTranslationApi } from '$lib/translation/add_translation_api'
	import { GetTranslationApi } from '$lib/translation/get_translation_api'
	import { TranslationText } from '$lib/translation/translation_text'
	import { Direction } from '$lib/view/direction'
	import { LocaleSelectElement } from '$lib/view/locale_select_element'
	import { WebLogger } from '$lib/view/log/web_logger'
	import { Message } from '$lib/view/message'
	import type { Locale, Text } from '@prisma/client'
	import { onMount } from 'svelte'
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import type { PageData } from './$types'
	// import { version } from '$app/environment'

	// console.log('version', version)

	export let data: PageData

	let new_text_element: HTMLInputElement
	let speech_element: HTMLElement
	let audio_element: HTMLAudioElement
	let from_locale_select_element: HTMLSelectElement
	let to_locale_select_element: HTMLSelectElement

	let texts: Text[] = []
	let selected_text: Text | undefined
	let translations: string[] = []
	let add_translation_string = ''
	let from_locale_code = LocaleCode.english_united_states
	let to_locale_code = LocaleCode.japanese_japan
	let web_speech_recognition: WebSpeechRecognition | undefined
	let listening = false

	const web_logger = new WebLogger('main')

	function init_locale_select(): void {
		const locales = JSON.parse(data.locales) as Locale[]

		new LocaleSelectElement(from_locale_select_element, locales).append_options_long()
		new LocaleSelectElement(to_locale_select_element, locales).append_options_long()
	}

	async function set_app_locale(): Promise<void> {
		$locale = from_locale_code.code
		await waitLocale($locale)
	}

	async function fetch_history(): Promise<void> {
		texts = await new TextsApi(from_locale_code).fetch()
	}

	function set_locale(): void {
		selected_text = undefined

		from_locale_code = new LocaleCode(from_locale_select_element.value)
		to_locale_code = new LocaleCode(to_locale_select_element.value)

		set_app_locale()
		fetch_history()
	}

	async function select_default_locales(): Promise<void> {
		const default_locales = new DefaultLocales(from_locale_select_element, to_locale_select_element)

		default_locales.load_from_storage()
		set_locale()
	}

	function store_locale(): void {
		localStorage.setItem('from_locale', from_locale_code.code)
		localStorage.setItem('to_locale', to_locale_code.code)
	}

	function switch_locales(): void {
		from_locale_select_element.value = to_locale_code.code
		to_locale_select_element.value = from_locale_code.code

		set_locale()
		store_locale()
	}

	function on_change_locale_select(): void {
		web_logger.info(
			`on_change_locale_select: from: ${from_locale_select_element.value}, to: ${to_locale_select_element.value}`
		)

		if (from_locale_select_element.value === to_locale_select_element.value) {
			switch_locales()
			return
		}

		set_locale()
		store_locale()
	}

	function on_click_history_text(text: Text): void {
		web_logger.info(
			`on_click_history_text: ${text.text}, locale: ${from_locale_select_element.value}`
		)

		if (text.text === selected_text?.text) {
			audio_element.currentTime = 0
			audio_element.play()
		} else {
			selected_text = text
			translations = []
		}
	}

	function validate_for_translation(): boolean {
		if (from_locale_code.code === to_locale_code.code) {
			translations = [`(${$_('select_different_language')})`]
			return false
		}

		if (!selected_text) {
			translations = [`(${$_('select_text_first')})`]
			return false
		}

		return true
	}

	async function show_translation(): Promise<void> {
		web_logger.info(
			`show_translation: selected_text: ${selected_text?.text}, from: ${from_locale_code.code}, to: ${to_locale_code.code}`
		)

		if (!validate_for_translation()) return
		if (!selected_text) return

		const speech_text = new SpeechText(selected_text.text)
		const translated_texts = await new GetTranslationApi(
			speech_text,
			from_locale_code,
			to_locale_code
		).fetch()

		translations = translated_texts.map((translation_text) => translation_text.text)
	}

	async function add_translation(): Promise<void> {
		web_logger.info(
			`add_translation: ${add_translation_string}, selected_text: ${selected_text?.text}`
		)

		if (!validate_for_translation()) return
		if (!selected_text) return
		if (!add_translation_string) return

		const text_id = new TextId(selected_text.id)
		const translation_text = new TranslationText(add_translation_string)

		await new AddTranslationApi(text_id, to_locale_code, translation_text).fetch()

		add_translation_string = ''

		await show_translation()
		// TODO: 選択されているテキストを探す
		// TODO: 翻訳を登録する
		// TODO: 選択されているテキストと翻訳を関連付ける
	}

	async function add_text(): Promise<void> {
		web_logger.info(`add_text: ${new_text_element.value}`)

		new_text_element.focus()

		if (!new_text_element.value) return

		const submission_text = new SubmissionText(new_text_element.value)
		const added_text = await new AddTextApi(from_locale_code, submission_text).fetch()

		// console.info('add_text', text)

		new_text_element.value = ''
		await fetch_history()
		on_click_history_text(added_text)

		return
	}

	function on_end_listening(): void {
		listening = false
	}

	function start_listening(): void {
		web_logger.info(
			`start_listening text:${selected_text?.text}, locale:${from_locale_select_element.value}`
		)

		const locale_code = new LocaleCode(from_locale_select_element.value)
		const hint_message = new Message($_('recognizing'))
		const speech_text_element = new SpeechTextElement(speech_element, hint_message)

		web_speech_recognition = new WebSpeechRecognition(
			locale_code,
			speech_text_element,
			on_end_listening
		)

		listening = true

		web_speech_recognition.start_not_continuous()
	}

	function stop_listening(): void {
		if (!web_speech_recognition) return

		web_speech_recognition.stop()

		on_end_listening()

		if (speech_element.textContent === $_('recognizing')) init_speech_element()
	}

	function handle_listen_button(): void {
		if (listening) {
			stop_listening()
		} else {
			start_listening()
		}
	}

	function init_speech_element(): void {
		speech_element.textContent = `(${$_('lets_talk')})`
	}

	function init(): void {
		translations = []
		init_speech_element()
	}

	onMount(async () => {
		if (!browser) return

		web_logger.add_event_listeners()
		init()
		init_locale_select()
		await select_default_locales()
	})

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<svelte:head>
	<title>Talk</title>
	<style>
		option {
			background-color: white !important;
		}
	</style>
</svelte:head>

<Navbar />
<div class="center-container my-3 flex h-[calc(100vh-77px)] w-screen flex-col gap-3">
	<div class="glass-panel flex flex-1 flex-col gap-2 overflow-y-auto pt-3">
		<div class="px-5">
			<select
				class="glass-button h-full grow text-center"
				bind:this={from_locale_select_element}
				on:change={() => on_change_locale_select()}
			/>
		</div>

		<div class="flex items-center gap-2 px-5">
			<input
				type="text"
				class="flex-1"
				placeholder={$_('enter_new_text')}
				bind:this={new_text_element}
			/>
			<IconButton on:click={add_text}><AddIcon /></IconButton>
		</div>
		<div class="overflow-y-auto">
			{#each texts as text, i}
				<TextListText
					{texts}
					{text}
					{i}
					{selected_text}
					on:click={() => on_click_history_text(text)}
					text_direction={new Direction(from_locale_code.code).value}
				/>
			{/each}
		</div>
	</div>

	<div class="glass-panel flex flex-col gap-4 px-5 pb-4 pt-2">
		{#if selected_text}
			<audio
				class="mt-2"
				controls
				bind:this={audio_element}
				src={new TextToSpeechUrl(selected_text.text, from_locale_code).url}
				autoplay
			/>
		{/if}

		<div class="flex flex-col gap-2">
			<div class="title flex flex-row items-center gap-4">
				{$_('speech')}
				<IconButton on:click={handle_listen_button}>
					{#if listening}
						<StopIcon />
					{:else}
						<VoiceIcon />
					{/if}
				</IconButton>
			</div>
			<div bind:this={speech_element} />
		</div>
		<Divider />
		<div class="flex flex-col gap-2">
			<div class="flex flex-row items-center gap-4">
				<div class="title">{$_('translation')}</div>
				<select
					class="glass-button text-center"
					bind:this={to_locale_select_element}
					on:change={() => on_change_locale_select()}
				/>
			</div>
			<div class="flex flex-row items-center gap-2">
				<IconButton on:click={show_translation}>
					<TranslateIcon />
				</IconButton>
				<div lang={to_locale_code.code} class="flex-1">
					{@html translations.join('<br />')}
				</div>
			</div>
			<div class="flex flex-row items-center gap-2">
				<input
					type="text"
					class="input flex-1"
					placeholder={$_('enter_new_translation')}
					lang={to_locale_code.code}
					bind:value={add_translation_string}
				/>
				<IconButton on:click={add_translation}>
					<AddIcon />
				</IconButton>
			</div>
		</div>
	</div>
</div>
<div />

<!-- <input type="text" bind:this={search_text} /> -->
