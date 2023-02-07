<script lang="ts">
	import { browser } from '$app/environment'
	import AddIcon from '$lib/components/icons/add_icon.svelte'
	import TranslateIcon from '$lib/components/icons/translate_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { LocaleCode } from '$lib/language/locale_code'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
	import { Message } from '$lib/view/message'
	import { SpeechText } from '$lib/speech/speech_text'
	import { TranslationText } from '$lib/translation/translation_text'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Locale, Text } from '@prisma/client'
	import { onMount } from 'svelte'
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import { TextsApi } from '$lib/text/texts_api'
	import { TranslateWithGoogleAdvancedApi } from '$lib/translation/translate_with_google_advanced_api'
	import { AddTranslationApi } from '$lib/translation/add_translation_api'
	import { AddTextApi } from '$lib/text/add_text_api'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { FindTranslationsApi } from '$lib/translation/find_translations_api'
	import IconButton from '$lib/components/icon_button.svelte'
	import { TextId } from '$lib/text/text_id'
	import Navbar from '$lib/components/navbar.svelte'
	import Divider from '$lib/components/divider.svelte'
	import TextListText from '$lib/components/text_list_text.svelte'
	import { LocaleSelectElement } from '$lib/view/locale_select_element'
	import { SpeechTextElement } from '$lib/speech/speech_text_element'
	import { WebSpeechRecognition } from '$lib/speech/web_speech_recognition'

	export let data: PageData

	let new_text_element: HTMLInputElement
	let text_list_element: HTMLDivElement
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

	$: from_locale_selected_value = from_locale_code.code
	$: to_locale_selected_value = to_locale_code.code
	$: from_speech_language_code = SpeechLanguageCode.create_from_locale_code(from_locale_code)
	$: to_speech_language_code = SpeechLanguageCode.create_from_locale_code(to_locale_code)

	function init_locale_select(): void {
		const locales = JSON.parse(data.locales) as Locale[]

		new LocaleSelectElement(from_locale_select_element, locales).append_options()
		new LocaleSelectElement(to_locale_select_element, locales).append_options()	
	}

	function speech_to_text(): void {
		const locale_code = LocaleCode.create(from_locale_select_element.value)
		const hint_message = new Message($_('recognizing'))

		const speech_text_element = new SpeechTextElement(speech_element, hint_message)
		const web_speech_recognition = new WebSpeechRecognition(locale_code, speech_text_element)

		web_speech_recognition.start_not_continuous()
	}

	async function fetch_texts(): Promise<void> {
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(from_locale_code)
		texts = await new TextsApi(speech_language_code).fetch()
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

	function set_locale(store_locale = true): void {
		selected_text = undefined

		if (!store_locale) {
			const from_locale = localStorage.getItem('from_locale')
			const to_locale = localStorage.getItem('to_locale')

			if (from_locale) from_locale_select_element.value = from_locale
			if (to_locale) to_locale_select_element.value = to_locale
		}

		from_locale_code = LocaleCode.create(from_locale_select_element.value)
		to_locale_code = LocaleCode.create(to_locale_select_element.value)

		if (store_locale) {
			localStorage.setItem('from_locale', from_locale_code.code)
			localStorage.setItem('to_locale', to_locale_code.code)
		}

		set_app_locale()
		fetch_texts()
	}

	async function set_app_locale(): Promise<void> {
		const language_code = SpeechLanguageCode.create_from_locale_code(from_locale_code)
		const app_locale_code = AppLocaleCode.from_speech_language_code(language_code)

		$locale = app_locale_code.code
		await waitLocale($locale)
	}

	function on_click_text(text: Text): void {
		// const language_code =
		// 	from_language_select.selectedOptions[0].getAttribute('language_code') ?? ''

		if (text.text === selected_text?.text) {
			console.log('same text')
			audio_element.currentTime = 0
			audio_element.play()
		} else {
			selected_text = text
			translations = []
		}

		// const voice_name = language_code === 'ja-JP' ? 'Google 日本語' : 'Google US English'

		// speech(selected_text, language_code, voice_name)
	}

	async function find_translation(): Promise<string[]> {
		if (!selected_text) return []

		const speech_language_code = SpeechLanguageCode.create_from_locale_code(to_locale_code)
		const text_id = new TextId(selected_text.id)
		const translation_texts = await new FindTranslationsApi(text_id, speech_language_code).fetch()
		const translations = translation_texts.map((translation_text) => translation_text.text)

		return translations
	}

	function validate_for_translation(): boolean {
		if (from_speech_language_code.equals(to_speech_language_code)) {
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
		if (!validate_for_translation()) return
		if (!selected_text) return

		const find_translation_result = await find_translation()

		if (find_translation_result.length > 0) {
			translations = find_translation_result
		} else {
			const source_translation_text = new TranslationText(selected_text.text)
			const app_locale_code = AppLocaleCode.from_speech_language_code(to_speech_language_code)
			const output_translation_text = await new TranslateWithGoogleAdvancedApi(
				source_translation_text,
				app_locale_code
			).fetch()

			const text_id = new TextId(selected_text.id)

			await new AddTranslationApi(text_id, to_speech_language_code, output_translation_text).fetch()

			translations = await find_translation()
			// console.info('translated', translation)
		}
	}

	async function add_translation(): Promise<void> {
		if (!validate_for_translation()) return
		if (!selected_text) return
		if (!add_translation_string) return

		// console.log('add_translation', selected_text)
		// console.log('language_to_code', language_to_code)

		const text_id = new TextId(selected_text.id)
		const translation_text = new TranslationText(add_translation_string)

		await new AddTranslationApi(text_id, to_speech_language_code, translation_text).fetch()

		add_translation_string = ''

		await show_translation()
		// TODO: 選択されているテキストを探す
		// TODO: 翻訳を登録する
		// TODO: 選択されているテキストと翻訳を関連付ける
	}

	function init(): void {
		translations = []
		speech_element.textContent = `(${$_('lets_talk')})`
	}

	async function add_text(): Promise<void> {
		new_text_element.focus()

		if (!new_text_element.value) return

		const speech_text = new SpeechText(new_text_element.value)
		const added_text = await new AddTextApi(from_speech_language_code, speech_text).fetch()

		// console.info('add_text', text)

		new_text_element.value = ''
		await fetch_texts()
		on_click_text(added_text)

		return
	}

	onMount(async () => {
		if (!browser) return

		init()
		init_locale_select()

		await select_default_locales()
	})
</script>

<svelte:head>
	<title>Talk</title>
</svelte:head>

<Navbar />
<div class="center-container w-screen h-[calc(100vh-69px)] flex flex-col">
	<div class="pt-3 glass-panel my-4 flex flex-col gap-2 flex-1 overflow-y-scroll">
		<div class="px-5">
			<select
				class="glass-button h-full grow text-center"
				bind:this={from_locale_select_element}
				on:change={() => on_change_locale_select(from_locale_select_element)}
			/>
		</div>

		<div class="flex gap-2 items-center px-5">
			<input
				type="text"
				class="flex-1"
				placeholder={$_('enter_new_text')}
				bind:this={new_text_element}
			/>
			<IconButton on_click_handler={add_text}><AddIcon /></IconButton>
		</div>
		<div bind:this={text_list_element} class="overflow-y-scroll">
			{#each texts as text, i}
				<TextListText
					{texts}
					{text}
					{i}
					{selected_text}
					on_click_text={() => on_click_text(text)}
				/>
			{/each}
		</div>
	</div>

	<div class="glass-panel pb-4 flex flex-col gap-4 px-5 pt-2">
		{#if selected_text}
			<audio
				class="mt-2"
				controls
				bind:this={audio_element}
				src={new TextToSpeechUrl(selected_text, from_locale_code).url}
				autoplay
			/>
		{/if}

		<div class="flex flex-col gap-2">
			<div class="title flex flex-row gap-4 items-center">
				{$_('speech')}
				<IconButton on_click_handler={speech_to_text}><VoiceIcon /></IconButton>
			</div>
			<div bind:this={speech_element} />
		</div>
		<Divider />
		<div class="flex flex-col gap-2">
			<div class="flex flex-row gap-4 items-center">
				<div class="title">{$_('translation')}</div>
				<select
					class="glass-button text-center"
					bind:this={to_locale_select_element}
					on:change={() => on_change_locale_select(to_locale_select_element)}
				/>
			</div>
			<div class="flex flex-row gap-2 items-center">
				<IconButton on_click_handler={show_translation}>
					<TranslateIcon />
				</IconButton>
				<div
					lang={AppLocaleCode.from_speech_language_code(to_speech_language_code).code}
					class="flex-1"
				>
					{@html translations.join('<br />')}
				</div>
			</div>
			<div class="flex flex-row gap-2 items-center">
				<input
					type="text"
					class="flex-1"
					placeholder={$_('enter_new_translation')}
					bind:value={add_translation_string}
				/>
				<IconButton on_click_handler={add_translation}>
					<AddIcon />
				</IconButton>
			</div>
		</div>
	</div>
</div>
<div />

<!-- <input type="text" bind:this={search_text} /> -->
