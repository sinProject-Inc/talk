<script lang="ts">
	import IconButton from '$lib/components/icon_button.svelte'
	import CloseIcon from '$lib/components/icons/close_icon.svelte'
	import SpeakerIcon from '$lib/components/icons/speaker_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import { LocaleCode } from '$lib/language/locale_code'
	import { Message } from '$lib/view/message'
	import { WebSpeech } from '$lib/speech/web_speech'
	import { TranslationText } from '$lib/translation/translation_text'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { TranslateWithGoogleAdvancedApi } from '$lib/translation/translate_with_google_advanced_api'
	import { createEventDispatcher, onMount } from 'svelte'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { browser } from '$app/environment'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
	import CopyIcon from '../icons/copy_icon.svelte'
	import StopIcon from '../icons/stop_icon.svelte'
	import Snackbar from '../snackbar.svelte'
	import { TextId } from '$lib/text/text_id'
	import { SpeechText } from '$lib/speech/speech_text'
	import { AddTextApi } from '$lib/text/add_text_api'
	import { FindTranslationsApi } from '$lib/translation/find_translations_api'
	import { AddTranslationApi } from '$lib/translation/add_translation_api'
	import type { Text } from '@prisma/client'
	import { text } from 'svelte/internal'

	export let locale_select_element: HTMLSelectElement
	export let locale_code = LocaleCode.english_united_states

	export let speech_text_element: HTMLTextAreaElement

	let body = ''

	export let audio_element: HTMLAudioElement
	export let audio_url: string

	export let listening = false
	export let either_listening = false

	let body_text: Text | undefined

	let snackbar_visible = false

	const dispatch = createEventDispatcher()

	let dispatch_timeout_id: ReturnType<typeof setTimeout>

	let web_speech: WebSpeech | undefined

	function speech_to_text(): void {
		if (!audio_element.paused) audio_element.pause()

		listening = true

		let selected_value = locale_select_element.selectedOptions[0].value
		const locale_code = LocaleCode.create(selected_value)
		const recognizing_message = new Message('Recognizing')
		web_speech = new WebSpeech(speech_text_element, recognizing_message)

		web_speech.recognition(locale_code, on_end, true)
	}

	async function stop_listening(): Promise<void> {
		if (!web_speech) return

		web_speech.stop_recognition()
		web_speech = undefined
	}

	async function on_end(): Promise<void> {
		listening = false

		add_text(speech_text_element.value).then(() => {
			dispatch_body_text()
		})
	}

	async function find_translation(text_id: TextId): Promise<string[]> {
		if (!text) return []

		const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

		const translation_texts = await new FindTranslationsApi(text_id, speech_language_code).fetch()
		const translations = translation_texts.map((translation_text) => translation_text.text)

		return translations
	}

	export async function show_translation(
		partner_body: string,
		text_id: number,
		play_audio = false
	): Promise<void> {
		const id = new TextId(text_id)

		const find_translation_result = await find_translation(id)

		if (find_translation_result.length > 0) {
			body = find_translation_result[0]
		} else {
			const source_translation_text = new TranslationText(partner_body)
			const language_code = SpeechLanguageCode.create(locale_code.code.split('-')[0])
			const app_locale_code = AppLocaleCode.from_speech_language_code(language_code)
			const output_translation_text = await new TranslateWithGoogleAdvancedApi(
				source_translation_text,
				app_locale_code
			).fetch()

			const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

			await new AddTranslationApi(id, speech_language_code, output_translation_text).fetch()

			body = output_translation_text.text
			
			await add_text(body)
		}

		if (play_audio) {
			await text_to_speech()
		}
	}

	export function set_body_text(text: Text | undefined): void {
		body_text = text
		body = text ? text.text : ''
	}

	export function get_body_text(): Text | undefined {
		return body_text
	}

	async function add_text(body_to_add: string): Promise<void> {		
		const speech_text = new SpeechText(body_to_add)
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

		body_text = await new AddTextApi(speech_language_code, speech_text).fetch()
		
		body = body_text.text

		return
	}

	async function dispatch_body_text(): Promise<void> {
		if (!body) return

		await add_text(body)

		if (!body_text) return

		dispatch('message', {
			body: body_text.text,
			text_id: body_text.id,
		})
	}

	function dispatch_clear_command(): void {
		dispatch('message', {
			clear: true,
		})
	}

	export async function text_to_speech(): Promise<void> {
		if (!body_text || either_listening) return

		audio_url = new TextToSpeechUrl(body_text, locale_code).url

		// Doesn't work without await
		await audio_element.pause()
		audio_element.currentTime = 0
		await audio_element.play()
	}

	function on_text_area_change(): void {
		const throttle = 1000

		if (!body) {
			dispatch_clear_command()

			return
		}

		clearTimeout(dispatch_timeout_id)

		dispatch_timeout_id = setTimeout(() => {
			dispatch_body_text()
		}, throttle)
	}

	function copy(): void {
		navigator.clipboard.writeText(body)

		snackbar_visible = true

		setTimeout(() => {
			snackbar_visible = false
		}, 2000)
	}

	export function clear(): void {
		if (!body) return

		body = ''
		dispatch_clear_command()
	}

	onMount(async () => {
		if (!browser) return
	})
</script>

<div class="glass-panel">
	<div class="grid">
		<div class="z-10 flex justify-end h-9 pr-[24px] pt-1" style="grid-area: 1/8/1/9">
			<div class="w-5">
				<IconButton on_click_handler={clear}><CloseIcon /></IconButton>
			</div>
		</div>
		<textarea
			class="pr-8 resize-none rounded-t-md border-0 outline-none outline-0 focus:outline-none"
			style="grid-area: 1/1/2/9"
			rows="7"
			bind:this={speech_text_element}
			bind:value={body}
			on:input={on_text_area_change}
		/>
	</div>
	<div class="flex rounded-b-md p-1">
		<div class="mr-auto flex gap-1">
			{#if listening}
				<IconButton on_click_handler={stop_listening}><StopIcon /></IconButton>
			{:else}
				<IconButton on_click_handler={speech_to_text}><VoiceIcon /></IconButton>
			{/if}
			<div class={either_listening ? 'fill-white/20' : ''}>
				<IconButton on_click_handler={text_to_speech}><SpeakerIcon /></IconButton>
			</div>
		</div>
		<div>
			<IconButton on_click_handler={copy}><CopyIcon /></IconButton>
		</div>
	</div>
</div>
<Snackbar text="Copied" visible={snackbar_visible} />

<audio class="hidden" src={audio_url} controls bind:this={audio_element} />
