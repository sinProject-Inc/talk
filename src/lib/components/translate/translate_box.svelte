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
	import { _ } from 'svelte-i18n'

	export let locale_select_element: HTMLSelectElement
	export let locale_code = LocaleCode.english_united_states

	export let speech_text_element: HTMLTextAreaElement

	export let audio_element: HTMLAudioElement

	export let listening = false
	export let either_listening = false

	let textarea_body = ''

	let text: Text | undefined

	let snackbar_visible = false

	const dispatch = createEventDispatcher<{
		message: { text?: Text; clear?: boolean; fetch_history?: boolean }
	}>()

	let dispatch_timeout_id: ReturnType<typeof setTimeout>

	let web_speech: WebSpeech | undefined

	function speech_to_text(): void {
		if (!audio_element.paused) audio_element.pause()

		textarea_body = ''
		dispatch_clear_command()

		speech_text_element.placeholder = $_('recognizing')

		listening = true

		let selected_value = locale_select_element.selectedOptions[0].value
		const locale_code = LocaleCode.create(selected_value)
		const recognizing_message = new Message('Recognizing')
		web_speech = new WebSpeech(speech_text_element, recognizing_message)

		web_speech.recognition(locale_code, on_finish_listening, true)
	}

	async function stop_listening(): Promise<void> {
		if (!web_speech) return

		web_speech.stop_recognition()
		web_speech = undefined
	}

	async function on_finish_listening(): Promise<void> {
		listening = false

		speech_text_element.placeholder = ''

		await add_text(speech_text_element.value)
		await dispatch_text()
	}

	async function find_translation(text_id: TextId): Promise<Text[]> {
		if (!text) return []

		const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

		const translation_texts = await new FindTranslationsApi(text_id, speech_language_code).fetch()

		return translation_texts
	}

	export async function show_translation(text: Text, play_audio = false): Promise<void> {
		const id = new TextId(text.id)

		const find_translation_result = await find_translation(id)

		if (find_translation_result.length > 0) {
			textarea_body = find_translation_result[0].text
		} else {
			const source_translation_text = new TranslationText(text.text)
			const language_code = SpeechLanguageCode.create(locale_code.code.split('-')[0])
			const app_locale_code = AppLocaleCode.from_speech_language_code(language_code)
			const output_translation_text = await new TranslateWithGoogleAdvancedApi(
				source_translation_text,
				app_locale_code
			).fetch()

			const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

			await new AddTranslationApi(id, speech_language_code, output_translation_text).fetch()

			textarea_body = output_translation_text.text
		}

		await add_text(textarea_body)

		if (play_audio) {
			await text_to_speech()
		}
	}

	export function set_text(new_text: Text | undefined): void {
		text = new_text
		textarea_body = text ? text.text : ''
	}

	export function get_text(): Text | undefined {
		return text
	}

	export async function add_text(textarea_body_to_add: string): Promise<void> {
		const speech_text = new SpeechText(textarea_body_to_add)
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

		text = await new AddTextApi(speech_language_code, speech_text).fetch()

		textarea_body = text.text

		dispatch_fetch_history_command()

		return
	}

	async function dispatch_text(): Promise<void> {
		if (!textarea_body) return
		if (!text) return

		dispatch('message', {
			text: text,
		})
	}

	function dispatch_clear_command(): void {
		dispatch('message', {
			clear: true,
		})
	}

	function dispatch_fetch_history_command(): void {
		dispatch('message', {
			fetch_history: true,
		})
	}

	export async function text_to_speech(): Promise<void> {
		if (!text) return

		if (either_listening) return

		audio_element.src = new TextToSpeechUrl(text, locale_code).url
		audio_element.load()
	}

	function on_text_area_change(): void {
		const throttle = 1000

		if (!textarea_body) {
			dispatch_clear_command()

			return
		}

		clearTimeout(dispatch_timeout_id)

		dispatch_timeout_id = setTimeout(async () => {
			await add_text(textarea_body)
			dispatch_text()
		}, throttle)
	}

	function copy(): void {
		navigator.clipboard.writeText(textarea_body)

		snackbar_visible = true

		setTimeout(() => {
			snackbar_visible = false
		}, 2000)
	}

	export function clear(): void {
		if (!textarea_body) return

		textarea_body = ''
		dispatch_clear_command()
	}

	onMount(async () => {
		if (!browser) return
	})
</script>

<div class="main-box glass-panel h-[calc((100vh-190px)/3)]">
	<div class="grid h-full -mb-11 pb-11">
		<div class="z-10 flex justify-end pr-[24px] pt-1" style="grid-area: 1/8/1/9">
			<div class="w-5">
				<IconButton on_click_handler={clear}><CloseIcon /></IconButton>
			</div>
		</div>
		<textarea
			class="text-area pr-8 resize-none rounded-t-md border-0 outline-none outline-0 focus:outline-none"
			style="grid-area: 1/1/10/9"
			bind:this={speech_text_element}
			bind:value={textarea_body}
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