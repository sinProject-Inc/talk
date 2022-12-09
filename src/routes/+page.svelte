<script lang="ts">
	import { browser } from '$app/environment'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Language, Text } from '@prisma/client'
	import { onMount } from 'svelte'
	import '../app.css'

	export let data: PageData

	let language_select_for_texts: HTMLSelectElement
	let voice_select: HTMLSelectElement
	let speech_to_text_language_select: HTMLSelectElement
	let textarea: HTMLTextAreaElement
	let audio_element: HTMLAudioElement

	let texts: Text[] = []
	let selected_text = ''
	let translated_text = ''

	// let search_text: HTMLInputElement

	// eslint-disable-next-line no-undef
	let synth: SpeechSynthesis
	// eslint-disable-next-line no-undef
	let voices: SpeechSynthesisVoice[] = []

	function set_languages_for_texts(): void {
		const languages = JSON.parse(data.languages_json_string) as Language[]

		languages.forEach((language) => {
			const option = document.createElement('option')

			option.textContent = `${language.name} [${language.code}]`

			option.setAttribute('data-code', language.code)
			option.setAttribute('data-name', language.name)

			language_select_for_texts.appendChild(option)
		})
	}

	async function fetch_texts(language_code: string): Promise<void> {
		const response = await fetch(`/api/text?language_code=${language_code}`)

		texts = (await response.json()) as Text[]
	}

	function populate_voice_list(): void {
		voices = synth.getVoices()

		const lang_set: Set<string> = new Set()

		voices.sort((a, b) => {
			const a_name = a.lang + a.name
			const b_name = b.lang + b.name

			if (a_name < b_name) return -1
			if (a_name == b_name) return 0
			return +1
		})

		voices.forEach((voice) => {
			const option = document.createElement('option')
			const default_text = voice.default ? ' -- DEFAULT' : ''

			option.textContent = `${voice.lang} (${voice.name}) ${default_text}`

			option.setAttribute('data-lang', voice.lang)
			option.setAttribute('data-name', voice.name)

			if (voice.default) {
				option.setAttribute('selected', 'selected')
			}

			voice_select.appendChild(option)

			lang_set.add(voice.lang)
		})

		const language_array = Array.from(lang_set)

		language_array.sort()

		language_array.forEach((lang) => {
			const option = document.createElement('option')
			option.textContent = lang
			option.setAttribute('data-lang', lang)
			option.setAttribute('data-name', lang)

			if (lang === 'en-US') {
				option.setAttribute('selected', 'selected')
			}

			speech_to_text_language_select.appendChild(option)
		})

		voice_select = voice_select
		speech_to_text_language_select = speech_to_text_language_select
	}

	function speech(text: string, language_code: string, voice_name: string): void {
		const utterance = new SpeechSynthesisUtterance(text)

		utterance.lang = language_code
		// search_text.value = language_code

		voices.find((voice) => {
			if (voice.name === voice_name) {
				utterance.voice = voice
				// console.log(voice)
			}
		})

		utterance.rate = 1
		utterance.pitch = 1
		utterance.volume = 1

		speechSynthesis.cancel()
		speechSynthesis.speak(utterance)
	}

	function text_to_speech(): void {
		const selected_language_code = voice_select.selectedOptions[0].getAttribute('data-lang') ?? ''
		const selected_voice_name = voice_select.selectedOptions[0].getAttribute('data-name') ?? ''

		speech(textarea.value, selected_language_code, selected_voice_name)
	}

	function recognition(lang: string): void {
		if (!('webkitSpeechRecognition' in window)) {
			textarea.value = 'Speech Recognition Not Available'
			return
		}

		textarea.value = 'Recognition...'

		const speech_recognition = window.SpeechRecognition || window.webkitSpeechRecognition
		const recognition = new speech_recognition()

		recognition.lang = lang
		recognition.interimResults = true
		// recognition.continuous = true;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		// recognition.onresult = (event: any): void => {
		// 	const result = event.results[0][0].transcript
		// 	textarea.value = result
		// }

		let finalTranscript = ''

		recognition.onresult = (event: any): void => {
			let interimTranscript = ''

			for (let i = event.resultIndex; i < event.results.length; i++) {
				let transcript = event.results[i][0].transcript

				if (event.results[i].isFinal) {
					finalTranscript += transcript
				} else {
					interimTranscript = transcript
				}
			}

			textarea.value = finalTranscript + interimTranscript
		}

		recognition.start()
	}

	function speech_to_text(): void {
		const selected_language =
			speech_to_text_language_select.selectedOptions[0].getAttribute('data-lang') ?? ''

		recognition(selected_language)
	}

	function on_change_language_select_for_texts(): void {
		const selected_language_code =
			language_select_for_texts.selectedOptions[0].getAttribute('data-code') ?? ''

		fetch_texts(selected_language_code)
	}

	function on_text_selected(text: string): void {
		const language_code =
			language_select_for_texts.selectedOptions[0].getAttribute('data-code') ?? ''

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

	onMount(() => {
		if (!browser) return

		set_languages_for_texts()

		language_select_for_texts.onchange = on_change_language_select_for_texts
		on_change_language_select_for_texts()

		synth = window.speechSynthesis
		synth.onvoiceschanged = populate_voice_list

		setTimeout(() => {
			populate_voice_list()
		}, 10)
	})

	async function translate(): Promise<void> {
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
			<select bind:this={language_select_for_texts} />
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

		<div class="footer flex_column gap_8px">
			{#if selected_text}
				{@const encoded_text = encodeURIComponent(selected_text)}
				<audio
					src="/api/text-to-speech/{encoded_text}"
					controls
					autoplay
					bind:this={audio_element}
				/>
			{/if}

			<div>
				<button on:click={translate}>Translate</button>
				{translated_text}
			</div>

			<!-- <button on:click={on_change_text_select}>Speech Selected Text</button> -->

			<div>
				<textarea placeholder="Enter text" value="Hello world!" bind:this={textarea} />
			</div>
			<select bind:this={voice_select} />
			<button on:click={text_to_speech}>Text-to-Speech</button>

			<select bind:this={speech_to_text_language_select} />
			<button on:click={speech_to_text}>Speech-to-Text</button>
		</div>
	</div>
	<div />
</div>

<!-- <input type="text" bind:this={search_text} /> -->
<style>
	.texts {
		width: 100%;
		height: 100%;
	}

	textarea {
		width: 100%;
		height: 100px;
	}
</style>
