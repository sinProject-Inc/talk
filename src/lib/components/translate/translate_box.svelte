<script lang="ts">
	import IconButton from '$lib/components/icon_button.svelte'
	import CloseIcon from '../icons/close_icon.svelte'
	import SpeakerIcon from '../icons/speaker_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import { LocaleCode } from '$lib/language/locale_code'
	import { Message } from '$lib/view/message'
	import { WebSpeech } from '$lib/speech/web-speech'
	import { TranslationText } from '$lib/translation/translation_text'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { TranslateWithGoogleAdvancedApi } from '$lib/translation/translate_with_google_advanced_api'
	import TranslateIcon from '../icons/translate_icon.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import { TextToSpeechUrl } from '$lib/speech/text_to_speech_url'
	import { browser } from '$app/environment'

	export let body = ''

	export let data: PageData


	export let onTextChange: () => void = () => {
		return
	}
	export let language_select_element: HTMLSelectElement
	export let locale_select_element: HTMLSelectElement

	export let partner_text = ''

	export let partner: HTMLTextAreaElement

	export let speech_text_element: HTMLTextAreaElement

	export let play = false

	let locale_code = LocaleCode.english_united_states


	export let hate_this_function: (value: string) => void = () => {
		return
	}

	let audio_element: HTMLAudioElement

	function speech_to_text(): void {
		let selected_value = locale_select_element.selectedOptions[0].value
		const locale_code = LocaleCode.create(selected_value)
		const recognizing_message = new Message('Recognizing')
		const web_speech = new WebSpeech(speech_text_element, recognizing_message)

		web_speech.recognition(locale_code, on_end)
	}

	function on_end() {
		body = locale_select_element.value
		console.log('hello')
		translate()
	}

	const dispatch = createEventDispatcher()

	async function translate(): Promise<void> {
		body = speech_text_element.value

		if (!body) return

		const source_translation_text = new TranslationText(body)
		const app_locale_code = AppLocaleCode.japanese
		const output_translation_text = await new TranslateWithGoogleAdvancedApi(
			source_translation_text,
			app_locale_code
		).fetch()
		
		dispatch_translated_body(output_translation_text.text)
	}

	function dispatch_translated_body(body: string): void {
		dispatch('message', {
			translated_body: body
		})
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


	export const set_text = (value: string) => {
		console.log(value)
		body = value
	}

	onMount(async () => {
		if (!browser) return
		console.log("data", data)
	})
	
</script>

<div class="glass-panel">
	<div class="grid">
		<div class="z-10 flex justify-end h-10 pr-[14px] pt-2" style="grid-area: 1/8/1/9">
			<div class="w-5 fill-white/90">
				<CloseIcon />
			</div>
		</div>
		<textarea
			bind:this={speech_text_element}
			bind:value={body}
			on:input={onTextChange}
			class="pr-8 resize-none rounded-t-md border-0 outline-none outline-0 focus:outline-none"
			style="grid-area: 1/1/2/9"
			rows="7"
		/>
	</div>
	<div class="flex rounded-b-md p-1">
		<div class="mr-auto flex gap-1">
			<IconButton onClickHandler={speech_to_text}><VoiceIcon /></IconButton>
			<IconButton><SpeakerIcon /></IconButton>
		</div>
		<div>
			<IconButton onClickHandler={translate}><TranslateIcon /></IconButton>
		</div>
	</div>
</div>

{#if play}
	<audio
		class="invisible fixed"
		controls
		autoplay
		bind:this={audio_element}
	/>
{/if}
