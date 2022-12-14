<script lang="ts">
	import { browser } from '$app/environment'
	import { Api } from '$lib/api'
	import { Html } from '$lib/html'
	import { WebSpeech } from '$lib/web-speech'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Language, Locale, Text } from '@prisma/client'
	import VoiceIcon from '$lib/icons/voice_icon.svelte'
	import { onMount } from 'svelte'
	import '../app.css'
	import TranslateIcon from '$lib/icons/translate_icon.svelte'
	import AddIcon from '$lib/icons/add_icon.svelte'
	import { _, locale, waitLocale } from 'svelte-i18n'
	import { Lang } from '$lib/lang'

	export let data: PageData

	let from_language_select_element: HTMLSelectElement
	let to_language_select_element: HTMLSelectElement
	let locale_select_element: HTMLSelectElement
	let new_text_element: HTMLInputElement
	let speech_text_element: HTMLElement
	let audio_element: HTMLAudioElement

	let texts: Text[] = []
	let selected_text = ''
	let translated_text = ''
	let language_from_code = ''
	let locale_code = ''
	let language_to_code = ''

	function init_language_select(): void {
		const languages = JSON.parse(data.languages) as Language[]

		Html.append_language_select_options(from_language_select_element, languages)
		Html.append_language_select_options(to_language_select_element, languages)
	}

	function speech_to_text(): void {
		const locale_code = locale_select_element.selectedOptions[0].value ?? ''

		WebSpeech.recognition(locale_code, speech_text_element, $_('recognizing'))
	}

	async function fetch_texts(): Promise<void> {
		texts = await new Api().texts(language_from_code)
	}

	async function on_change_from_language_select(store_language = true): Promise<void> {
		language_from_code = from_language_select_element.selectedOptions[0].value ?? ''

		fetch_texts()

		const locales = JSON.parse(data.locales) as Locale[]

		selected_text = ''

		Html.append_locale_select_options(locale_select_element, locales, language_from_code)
		on_change_locale_select(store_language)

		// console.log(language_code)

		$locale = Lang.to_text_language_code(language_from_code)
		await waitLocale()

		if (store_language) {
			localStorage.setItem('language_from', language_from_code)
		}

		setTimeout(() => {
			init()
		}, 10)
	}

	async function select_default_language(): Promise<void> {
		const language_from = localStorage.getItem('language_from')
		if (language_from) from_language_select_element.value = language_from

		const language_to = localStorage.getItem('language_to')
		if (language_to) to_language_select_element.value = language_to

		await on_change_from_language_select(false)
		on_change_translation_language_select(false)
	}

	function on_change_locale_select(store_locale = true): void {
		console.log('on_change_locale_select')

		if (!store_locale) {
			const locale = localStorage.getItem('locale')
			if (locale) locale_select_element.value = locale
		}

		locale_code = locale_select_element.selectedOptions[0].value ?? ''

		if (store_locale) {
			localStorage.setItem('locale', locale_code)
		}
	}

	function on_click_text(text: string): void {
		// const language_code =
		// 	from_language_select.selectedOptions[0].getAttribute('language_code') ?? ''

		if (text === selected_text) {
			console.log('same text')
			audio_element.play()
		} else {
			selected_text = text
			translated_text = ''
		}

		// const voice_name = language_code === 'ja-JP' ? 'Google 日本語' : 'Google US English'

		// speech(selected_text, language_code, voice_name)
	}

	function add_translation(): void {
		// TODO:
	}

	async function show_translation(): Promise<void> {
		if (language_from_code === language_to_code) {
			translated_text = `(${$_('select_different_language')})`
			return
		}

		if (!selected_text) {
			translated_text = `(${$_('select_text_first')})`
			return
		}

		translated_text = await new Api().translate_by_google(selected_text, language_to_code)
	}

	function init(): void {
		translated_text = ''
		speech_text_element.textContent = `(${$_('lets_talk')})`
	}

	function on_change_translation_language_select(store_language = true): void {
		language_to_code = to_language_select_element.selectedOptions[0].value ?? ''

		if (store_language) {
			localStorage.setItem('language_to', language_to_code)
		}
	}

	async function add_text(): Promise<void> {
		new_text_element.focus()

		if (!new_text_element.value) return

		await new Api().add_text(new_text_element.value, language_from_code)

		// console.info('add_text', text)

		new_text_element.value = ''
		fetch_texts()

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
	<div class="center_container">
		<div class="header flex_row align_items_center">{$_('talk_title')}</div>
	</div>
</div>

<div class="flex_row root_container">
	<div />
	<div class="center_container">
		<div class="scroll_area flex_column gap_8px">
			<div>
				<select
					bind:this={from_language_select_element}
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

			<div class="border_radius flex_column gap_border">
				{#each texts as text}
					<div
						class="padding_10px_16px cursor_pointer hover"
						on:click={() => on_click_text(text.text)}
						on:keydown
					>
						{text.text}
					</div>
				{/each}
			</div>
		</div>

		<div class="footer flex_column gap_16px">
			<div>
				<audio
					src={new Api().get_speech_to_text_url(selected_text, locale_code)}
					controls
					autoplay
					bind:this={audio_element}
				/>
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
						lang={Lang.to_text_language_code(language_to_code)}
						class="flex_1 overflow_wrap_anywhere"
					>
						{translated_text}
					</div>
				</div>
				<div class="flex_row gap_8px align_items_center">
					<input type="text" class="flex_1" placeholder={$_('enter_new_translation')} />
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
