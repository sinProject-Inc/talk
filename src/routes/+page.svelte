<script lang="ts">
	import { browser } from '$app/environment'
	import { Api } from '$lib/api/api'
	import AddIcon from '$lib/icons/add_icon.svelte'
	import SigninIcon from '$lib/icons/signin_icon.svelte'
	import TranslateIcon from '$lib/icons/translate_icon.svelte'
	import VoiceIcon from '$lib/icons/voice_icon.svelte'
	import { TextId } from '$lib/general/text_id'
	import { Html } from '$lib/view/html'
	import { WebSpeech } from '$lib/speech/web-speech'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { LocaleCode } from '$lib/language/locale_code'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
	import { Message } from '$lib/view/message'
	import { SpeechText } from '$lib/speech/speech_text'
	import { TranslationText } from '$lib/translation/translation_text'
	import { page } from '$app/stores'
	// import { Api } from '$lib/api'
	// import { Html } from '$lib/html'
	// import { WebSpeech } from '$lib/web-speech'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Language, Locale, Text } from '@prisma/client'
	import { onMount } from 'svelte'
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import '../app.css'

	export let data: PageData

	let from_speech_language_select_element: HTMLSelectElement
	let to_language_select_element: HTMLSelectElement
	let locale_select_element: HTMLSelectElement
	let new_text_element: HTMLInputElement
	let text_list_element: HTMLDivElement
	let speech_text_element: HTMLElement
	let audio_element: HTMLAudioElement

	let texts: Text[] = []
	let selected_text: Text | undefined
	let translations: string[] = []
	let from_speech_language_code = SpeechLanguageCode.english
	let locale_code = LocaleCode.english_united_states
	let to_speech_language_code = SpeechLanguageCode.japanese
	let add_translation_string = ''

	function init_language_select(): void {
		const languages = JSON.parse(data.languages) as Language[]

		Html.append_language_select_options(from_speech_language_select_element, languages)
		Html.append_language_select_options(to_language_select_element, languages)
	}

	function speech_to_text(): void {
		const selected_value = locale_select_element.selectedOptions[0].value
		const locale_code = LocaleCode.create(selected_value)
		const recognizing_message = new Message($_('recognizing'))
		const web_speech = new WebSpeech(speech_text_element, recognizing_message)

		web_speech.recognition(locale_code)
	}

	async function fetch_texts(): Promise<void> {
		texts = await new Api().texts(from_speech_language_code)
	}

	async function on_change_from_language_select(store_language = true): Promise<void> {
		reset_background_color()

		const selected_value = from_speech_language_select_element.selectedOptions[0].value

		from_speech_language_code = SpeechLanguageCode.create(selected_value)

		fetch_texts()

		const locales = JSON.parse(data.locales) as Locale[]

		selected_text = undefined

		Html.append_locale_select_options(locale_select_element, locales, from_speech_language_code)
		on_change_locale_select(store_language)

		// console.log(language_code)

		const app_locale_code = AppLocaleCode.fromSpeechLanguageCode(from_speech_language_code)

		$locale = app_locale_code.code
		await waitLocale($locale)

		if (store_language) {
			localStorage.setItem('language_from', from_speech_language_code.code)
		}

		init()
	}

	async function select_default_language(): Promise<void> {
		const language_from = localStorage.getItem('language_from')
		if (language_from) from_speech_language_select_element.value = language_from

		const language_to = localStorage.getItem('language_to')
		if (language_to) to_language_select_element.value = language_to

		await on_change_from_language_select(false)
		on_change_translation_language_select(false)
	}

	function on_change_locale_select(store_locale = true): void {
		// console.log('on_change_locale_select')

		if (!store_locale) {
			const locale = localStorage.getItem('locale')
			if (locale) locale_select_element.value = locale
		}

		const selected_value = locale_select_element.selectedOptions[0].value

		locale_code = LocaleCode.create(selected_value)

		if (store_locale) {
			localStorage.setItem('locale', locale_code.code)
		}
	}

	function reset_background_color(): void {
		console.log('reset_color')
		const child_array = Array.from(text_list_element.children) as HTMLElement[]

		child_array.forEach((child) => {
			child.style.backgroundColor = 'var(--background-color)'
		})
	}

	function on_click_text(text: Text): void {
		reset_background_color()

		const child_array = Array.from(text_list_element.children) as HTMLElement[]
		const select_element = child_array.find((child) => child.id === text.id.toString())

		if (select_element) {
			select_element.style.backgroundColor = 'var(--border-color)'
		}

		// const language_code =
		// 	from_language_select.selectedOptions[0].getAttribute('language_code') ?? ''

		if (text.text === selected_text?.text) {
			console.log('same text')
			audio_element.currentTime = 0
			audio_element.play()
		} else {
			selected_text = text
			translations = []
			console.log('selected')
		}

		// const voice_name = language_code === 'ja-JP' ? 'Google 日本語' : 'Google US English'

		// speech(selected_text, language_code, voice_name)
	}

	async function find_translation(): Promise<string[]> {
		if (!selected_text) return []

		const text_id = new TextId(selected_text.id)
		const translation_texts = await new Api().find_translation(text_id, to_speech_language_code)
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
			const app_locale_code = AppLocaleCode.fromSpeechLanguageCode(to_speech_language_code)
			const output_translation_text = await new Api().translate_by_google_advanced(
				source_translation_text,
				app_locale_code
			)

			const text_id = new TextId(selected_text.id)

			await new Api().add_translation(text_id, to_speech_language_code, output_translation_text)

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

		await new Api().add_translation(text_id, to_speech_language_code, translation_text)

		add_translation_string = ''

		await show_translation()
		// TODO: 選択されているテキストを探す
		// TODO: 翻訳を登録する
		// TODO: 選択されているテキストと翻訳を関連付ける
	}

	function init(): void {
		translations = []
		speech_text_element.textContent = `(${$_('lets_talk')})`
	}

	function on_change_translation_language_select(store_language = true): void {
		const selected_value = to_language_select_element.selectedOptions[0].value

		to_speech_language_code = SpeechLanguageCode.create(selected_value)

		if (store_language) {
			localStorage.setItem('language_to', to_speech_language_code.code)
		}
	}

	async function add_text(): Promise<void> {
		new_text_element.focus()

		if (!new_text_element.value) return

		const speech_text = new SpeechText(new_text_element.value)
		const added_text = await new Api().add_text(from_speech_language_code, speech_text)

		// console.info('add_text', text)

		new_text_element.value = ''
		await fetch_texts()
		on_click_text(added_text)

		return
	}

	onMount(async () => {
		if (!browser) return

		init_language_select()
		// from_language_select.onchange = on_change_language_select_for_texts
		// on_change_from_language_select()
		await select_default_language()
	})
</script>

<div class="flex_row root_container header header_background_color">
	<div class="center_container flex_row">
		<div class="header_left flex_row align_items_center">{$_('talk_title')}</div>

		{#if $page.data.user}
		<div class="header_right flex_row align_items_center">
			<div>{$page.data.user.email}</div>
			<form action="/sign-out" method="POST">
				<button type="submit">{$_('logout')}</button>
			</form>
		</div>
		{:else}
		<a class="header_right flex_row align_items_center signin_button" href="/sign-in"><div class="flex_row gap-1 items-center">
			<div class="flex_row justify_content_center h-5">
				<SigninIcon />
			</div>
			<div>{$_('sign_in')}</div>
		</div></a>
		{/if}
	</div>
</div>

<div class="flex_row root_container">
	<div />
	<div class="center_container">
		<div class="scroll_area flex_column gap_8px">
			<div>
				<select
					bind:this={from_speech_language_select_element}
					on:change={() => on_change_from_language_select()}
				/>
				<select bind:this={locale_select_element} on:change={() => on_change_locale_select()} />
			</div>

			<div class="flex_row gap_8px align_items_center">
				<input
					type="text"
					class="flex_1"
					placeholder={$_('enter_new_text')}
					bind:this={new_text_element}
				/>
				<button on:click={add_text}>
					<div class="flex_row justify_content_center height_24px"><AddIcon /></div>
				</button>
			</div>

			<div class="border_radius flex_column gap_border" bind:this={text_list_element}>
				{#each texts as text}
					<div
						class="padding_10px_16px cursor_pointer hover"
						id={text.id.toString()}
						on:click={() => on_click_text(text)}
						on:keydown
					>
						{text.text}
					</div>
				{/each}
			</div>
		</div>

		<div class="footer flex_column gap_16px">
			<div>
				{#if selected_text}
					<audio
						src={new Api().get_text_to_speech_url(selected_text?.text ?? '', locale_code)}
						controls
						autoplay
						bind:this={audio_element}
					/>
				{/if}
			</div>

			<div class="flex_column gap_8px">
				<div class="title flex_row gap_16px align_items_center">
					{$_('speech')}
					<button on:click={speech_to_text}
						><div class="flex_row justify_content_center height_24px"><VoiceIcon /></div></button
					>
				</div>
				<div bind:this={speech_text_element} />
			</div>

			<div class="flex_column gap_8px">
				<div class="title flex_row gap_16px align_items_center">
					{$_('translation')}
					<select
						bind:this={to_language_select_element}
						on:change={() => on_change_translation_language_select()}
					/>
				</div>
				<div class="flex_row gap_8px align_items_center">
					<button on:click={show_translation}>
						<div class="flex_row justify_content_center height_24px"><TranslateIcon /></div>
					</button>
					<div
						lang={AppLocaleCode.fromSpeechLanguageCode(to_speech_language_code).code}
						class="flex_1 overflow_wrap_anywhere"
					>
						{@html translations.join('<br />')}
					</div>
				</div>
				<div class="flex_row gap_8px align_items_center">
					<input
						type="text"
						class="flex_1"
						placeholder={$_('enter_new_translation')}
						bind:value={add_translation_string}
					/>
					<button on:click={add_translation}>
						<div class="flex_row justify_content_center height_24px"><AddIcon /></div>
					</button>
				</div>
			</div>
		</div>
	</div>
	<div />
</div>

<!-- <input type="text" bind:this={search_text} /> -->
