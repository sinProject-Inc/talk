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

	export let locale_select_element: HTMLSelectElement
	export let locale_code = LocaleCode.english_united_states

	export let speech_text_element: HTMLTextAreaElement
	export let body = ''

	export let audio_element: HTMLAudioElement
	export let audio_url: string

	export let listening = false
	export let either_listening = false

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

	function on_end(): void {
		listening = false

		body = speech_text_element.value

		dispatch_body()
	}

	const dispatch = createEventDispatcher()

	export async function show_translation(text: string, play_audio = false): Promise<void> {
		const source_translation_text = new TranslationText(text)
		const language_code = SpeechLanguageCode.create(locale_code.code.split('-')[0])
		const app_locale_code = AppLocaleCode.from_speech_language_code(language_code)

		const output_translation_text = await new TranslateWithGoogleAdvancedApi(
			source_translation_text,
			app_locale_code
		).fetch()

		body = output_translation_text.text

		if (play_audio) {
			await text_to_speech()
		}
	}

	export function set_body(text: string): void {
		body = text
	}

	export function get_body(): string {
		return body
	}

	function dispatch_body(): void {
		if (body == '') return

		dispatch('message', {
			text: body,
		})
	}

	function dispatch_clear_command(): void {
		dispatch('message', {
			clear: true,
		})
	}

	export async function text_to_speech(): Promise<void> {
		if (body == '' || either_listening) return

		audio_url = new TextToSpeechUrl(body, locale_code).url

		await audio_element.pause()
		await audio_element.play()
	}

	function on_text_area_change(): void {
		const throttle = 1000

		if (body == '') {
			dispatch_clear_command()

			return
		}

		clearTimeout(dispatch_timeout_id)

		dispatch_timeout_id = setTimeout(() => {
			dispatch_body()
		}, throttle)
	}

	function copy(): void {
		navigator.clipboard.writeText(body)
	}

	export function clear(): void {
		if (body == '') return
		
		body = ''
		dispatch_clear_command()
	}

	onMount(async () => {
		if (!browser) return
	})
</script>

<div class="glass-panel">
	<div class="grid">
		<div class="z-10 flex justify-end h-9 pr-[14px] pt-2" style="grid-area: 1/8/1/9">
			<button class="p-0" on:click={clear}>
				<div class="w-5 fill-white/90">
					<CloseIcon />
				</div>
			</button>
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
				<IconButton onClickHandler={stop_listening}><StopIcon /></IconButton>
			{:else}
				<IconButton onClickHandler={speech_to_text}><VoiceIcon /></IconButton>
			{/if}
			<div class="{either_listening ? 'fill-white/20' : ''}">
				<IconButton onClickHandler={text_to_speech}><SpeakerIcon /></IconButton>
			</div>
		</div>
		<div>
			<IconButton onClickHandler={copy}><CopyIcon /></IconButton>
		</div>
	</div>
</div>

<audio class="hidden" src={audio_url} controls bind:this={audio_element} />