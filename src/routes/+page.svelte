<script lang="ts">
	import { browser } from '$app/environment'
	import { Api } from '$lib/api'
	import { Html } from '$lib/html'
	import { WebSpeech } from '$lib/web-speech'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Language, Text } from '@prisma/client'
	import VoiceIcon from '$lib/icons/voice_icon.svelte'
	import { onMount } from 'svelte'
	import '../app.css'
	import TranslateIcon from '$lib/icons/translate_icon.svelte'
	import AddIcon from '$lib/icons/add_icon.svelte'

	export let data: PageData

	let from_language_select: HTMLSelectElement
	let to_language_select: HTMLSelectElement
	// let locale_select: HTMLSelectElement
	let speech_text_element: HTMLElement
	let audio_element: HTMLAudioElement

	let texts: Text[] = []
	let selected_text = ''
	let translated_text = ''

	function set_languages_for_texts(): void {
		const languages = JSON.parse(data.languages_json_string) as Language[]

		Html.append_language_select_options(from_language_select, languages)
		Html.append_language_select_options(to_language_select, languages)
	}

	function speech_to_text(): void {
		// const selected_language =
		// 	speech_to_text_language_select.selectedOptions[0].getAttribute('data-lang') ?? ''

		WebSpeech.recognition('en-US', speech_text_element)
	}

	async function on_change_language_select_for_texts(): Promise<void> {
		const selected_language_code =
			from_language_select.selectedOptions[0].getAttribute('language_code') ?? ''

		texts = await Api.get_texts(selected_language_code)
	}

	function on_text_selected(text: string): void {
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

	onMount(() => {
		if (!browser) return

		speech_text_element.textContent = '(No speech text)'

		set_languages_for_texts()

		from_language_select.onchange = on_change_language_select_for_texts
		on_change_language_select_for_texts()
	})

	async function show_translation(): Promise<void> {
		if (!selected_text) {
			translated_text = '(Select text first)'
		}

		const encoded_text = encodeURIComponent(selected_text)
		const url = `/api/translate_by_deepl/${encoded_text}/ja`
		// TODO: LANG
		const response = await fetch(url)

		translated_text = (await response.json()) as string
	}
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
				<select bind:this={from_language_select} />
				<select>
					<option value="en-US">United States</option>
					<option value="ja-JP">日本</option>
				</select>
			</div>
			<div class="border_radius flex_column gap_border">
				{#each texts as text}
					<div
						class="padding_10px_16px cursor_pointer hover"
						on:click={() => on_text_selected(text.text)}
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
					{@const encoded_text = encodeURIComponent(selected_text)}
					<audio
						src="/api/text-to-speech/{encodeURIComponent(selected_text)}"
						controls
						autoplay
						bind:this={audio_element}
					/>
				{:else}
					<audio src="" controls autoplay />
				{/if}
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
