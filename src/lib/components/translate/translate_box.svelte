<script lang="ts">
	import { browser } from '$app/environment'
	import CloseIcon from '$lib/components/icons/close_icon.svelte'
	import SpeakerIcon from '$lib/components/icons/speaker_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import CopyIcon from '$lib/components/icons/copy_icon.svelte'
	import StopIcon from '$lib/components/icons/stop_icon.svelte'
	import Snackbar from '$lib/components/snackbar.svelte'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { LocaleCode } from '$lib/language/locale_code'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
	import { SpeechTextAreaElement } from '$lib/speech/speech_text_area_element'
	import { WebSpeechRecognition } from '$lib/speech/web_speech_recognition'
	import { AddTextApi } from '$lib/text/add_text_api'
	import { TextId } from '$lib/text/text_id'
	import { AddTranslationApi } from '$lib/translation/add_translation_api'
	import { FindTranslationsApi } from '$lib/translation/find_translations_api'
	import { TranslateWithGoogleAdvancedApi } from '$lib/translation/translate_with_google_advanced_api'
	import { TranslationText } from '$lib/translation/translation_text'
	import { Message } from '$lib/view/message'
	import type { Text } from '@prisma/client'
	import { createEventDispatcher, onMount } from 'svelte'
	import { _ } from 'svelte-i18n'
	import { SubmissionText } from '$lib/speech/submission_text'
	import { TextError } from '$lib/general/text_error'

	export let locale_select_element: HTMLSelectElement
	export let speech_text_element: HTMLTextAreaElement
	export let audio_element: HTMLAudioElement

	export let locale_code = LocaleCode.english_united_states

	export let listening = false
	export let partner_listening = false

	export let playing_text: Text | undefined
	export let playing_text_locale: LocaleCode | undefined

	let textarea_body = ''

	let text: Text | undefined

	let snackbar_visible = false

	const dispatch = createEventDispatcher<{
		error: { message_id: string }
		message: { text?: Text; clear?: boolean; fetch_history?: boolean; text_to_speech?: boolean }
	}>()

	let web_speech_recognition: WebSpeechRecognition | undefined

	function speech_to_text(): void {
		if (partner_listening) return
		if (audio_element && !audio_element.paused) audio_element.pause()

		textarea_body = ''
		dispatch_clear_partner_command()

		listening = true

		const locale_code = LocaleCode.create(locale_select_element.value)
		const hint_message = new Message($_('recognizing'))

		const speech_text_area_element = new SpeechTextAreaElement(speech_text_element, hint_message)

		web_speech_recognition = new WebSpeechRecognition(
			locale_code,
			speech_text_area_element,
			on_finish_listening
		)
		web_speech_recognition.start_continuous()
	}

	async function stop_listening(): Promise<void> {
		if (!web_speech_recognition) return

		web_speech_recognition.stop()
		web_speech_recognition = undefined
	}

	async function handle_listen_button(): Promise<void> {
		if (listening) {
			await stop_listening()
		} else {
			speech_to_text()
		}
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

	export async function add_text(textarea_body_to_add: string): Promise<boolean> {
		try {
			const submission_text = new SubmissionText(textarea_body_to_add)

			const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

			text = await new AddTextApi(speech_language_code, submission_text).fetch()

			textarea_body = text.text

			dispatch_fetch_history_command()

			return true
		} catch (error) {
			if (error instanceof TextError) {
				dispatch_error(error.message_id)
				dispatch_clear_partner_command()
			} else {
				throw error
			}
			return false
		}
	}

	async function dispatch_error(message_id: string): Promise<void> {
		dispatch('error', { message_id })
	}

	async function dispatch_text(): Promise<void> {
		if (!textarea_body) return
		if (!text) return

		dispatch('message', {
			text: text,
		})
	}

	function dispatch_clear_partner_command(): void {
		dispatch('message', {
			clear: true,
		})
	}

	function dispatch_fetch_history_command(): void {
		dispatch('message', {
			fetch_history: true,
		})
	}

	function dispatch_text_to_speech_command(): void {
		dispatch('message', {
			text_to_speech: true,
		})
	}

	export function text_to_speech(): void {
		if (!text) return

		if (text.text === playing_text?.text) {
			audio_element.currentTime = 0
			audio_element.play()
		} else {
			playing_text = text
			playing_text_locale = locale_code
		}
	}

	async function on_text_area_keydown(event: KeyboardEvent): Promise<void> {
		if (event.key === 'Enter') {
			event.preventDefault()

			if (event.isComposing) return

			if (!textarea_body) {
				dispatch_clear_partner_command()
				clear_self()

				return
			}

			if (textarea_body === text?.text) {
				dispatch_text_to_speech_command()

				return
			}

			const text_added = await add_text(textarea_body)
			if (text_added) {
				dispatch_text()
			}
		}
	}

	export function set_speech_element_placeholder(hint: string): void {
		const hint_message = new Message(hint)

		speech_text_element.placeholder = hint_message.text
	}

	function copy(): void {
		navigator.clipboard.writeText(textarea_body)

		snackbar_visible = true

		setTimeout(() => {
			snackbar_visible = false
		}, 2000)
	}

	export function clear_self(): void {
		text = undefined

		if (!textarea_body) return

		textarea_body = ''
	}

	export function focus(): void {
		speech_text_element.focus()
	}

	onMount(async () => {
		if (!browser) return
	})
</script>

<div class="main-box glass-panel row-span-1">
	<div class="grid h-full -mb-11 pb-11">
		<div class="z-10 flex justify-end pr-[24px] pt-1" style="grid-area: 1/8/1/9">
			<div class="w-5">
				<IconButton on_click_handler={clear_self}><CloseIcon /></IconButton>
			</div>
		</div>
		<textarea
			class="text-area pr-8 resize-none rounded-t-md border-0 outline-none outline-0 focus:outline-none"
			style="grid-area: 1/1/10/9"
			bind:this={speech_text_element}
			bind:value={textarea_body}
			on:keydown={on_text_area_keydown}
		/>
	</div>
	<div class="flex rounded-b-md p-1">
		<div class="mr-auto flex gap-1">
			<div class="{partner_listening ? 'fill-white/20' : ''} listen-button">
				<IconButton on_click_handler={handle_listen_button}>
					{#if listening}
						<StopIcon />
					{:else}
						<VoiceIcon />
					{/if}
				</IconButton>
			</div>
			<div class={listening || partner_listening ? 'fill-white/20' : ''}>
				<IconButton on_click_handler={text_to_speech}><SpeakerIcon /></IconButton>
			</div>
		</div>
		<div>
			<IconButton on_click_handler={copy}><CopyIcon /></IconButton>
		</div>
	</div>
</div>
<Snackbar text="Copied" visible={snackbar_visible} />
