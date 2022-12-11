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

	export let data: PageData

	let from_language_select: HTMLSelectElement
	let to_language_select: HTMLSelectElement
	let locale_select: HTMLSelectElement
	let speech_text_element: HTMLElement
	let audio_element: HTMLAudioElement

	let texts: Text[] = []
	let selected_text = ''
	let translated_text = ''
	let locale_code = ''

	function init_language_select(): void {
		const languages = JSON.parse(data.languages) as Language[]

		Html.append_language_select_options(from_language_select, languages)
		Html.append_language_select_options(to_language_select, languages)
	}

	function speech_to_text(): void {
		// const selected_language =
		// 	speech_to_text_language_select.selectedOptions[0].getAttribute('data-lang') ?? ''

		WebSpeech.recognition('en-US', speech_text_element)
	}

	async function on_change_from_language_select(): Promise<void> {
		const language_code = from_language_select.selectedOptions[0].value ?? ''

		texts = await new Api().texts(language_code)

		const locales = JSON.parse(data.locales) as Locale[]

		selected_text = ''

		Html.append_locale_select_options(locale_select, locales, language_code)
		on_change_locale_select()
	}

	function on_change_locale_select(): void {
		locale_code = locale_select.selectedOptions[0].value ?? ''
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

	function get_speech_to_text_url(selected_text: string, locale_code: string): string {
		if (selected_text === '' || locale_code === '') return ''

		const encoded_text = encodeURIComponent(selected_text)
		const url = `/api/text-to-speech/${encoded_text}/${locale_code}`

		return url
	}

	// async function fetch_languages(): Promise<void> {
	// 	const response = await fetch('/api/languages')
	// 	const languages = response.json()

	// 	console.log(languages)
	// }

	// fetch_languages()

	async function show_translation(): Promise<void> {
		if (!selected_text) {
			translated_text = '(Select text first)'
		}

		const encoded_text = encodeURIComponent(selected_text)
		const url = `/api/translate_by_deepl/${encoded_text}/ja`
		// TODO: Translate to selected language #77
		const response = await fetch(url)

		translated_text = (await response.json()) as string
	}

	onMount(() => {
		if (!browser) return

		speech_text_element.textContent = '(No speech text)'

		init_language_select()

		// from_language_select.onchange = on_change_language_select_for_texts
		on_change_from_language_select()
	})
</script>

<div class="flex_row root_container header header_background_color">
	<div class="center_container">
		<div class="header flex_row align_items_center">Talk</div>
	</div>
</div>

<div class="flex_row root_container">
	<div />
	<div class="center_container">
		<div class="scroll_area flex_column gap_8px">
			<div>
				<select bind:this={from_language_select} on:change={on_change_from_language_select} />
				<select bind:this={locale_select} on:change={on_change_locale_select} />
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
					src={get_speech_to_text_url(selected_text, locale_code)}
					controls
					autoplay
					bind:this={audio_element}
				/>
			</div>

			<div class="flex_column gap_8px">
				<div class="title flex_row gap_16px align_items_center">
					Speech
					<button on:click={speech_to_text}
						><div class="flex_row justify_content_center height_24px"><VoiceIcon /></div></button
					>
				</div>
				<div bind:this={speech_text_element} />
			</div>

			<div class="flex_column gap_8px">
				<div class="title flex_row gap_16px align_items_center">
					Translation
					<select bind:this={to_language_select} />
				</div>
				<div class="flex_row gap_8px align_items_center">
					<button on:click={show_translation}
						><div class="flex_row justify_content_center height_24px">
							<TranslateIcon />
						</div></button
					>
					{translated_text}
				</div>
				<div class="flex_row gap_8px align_items_center">
					<button on:click={add_translation}
						><div class="flex_row justify_content_center height_24px"><AddIcon /></div></button
					>
					<input type="text" class="flex_auto" />
				</div>
			</div>
		</div>
	</div>
	<div />
</div>

<!-- <input type="text" bind:this={search_text} /> -->
