<script lang="ts">
	import { browser } from '$app/environment'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import { onMount } from 'svelte'
	import type { Language } from '@prisma/client'

	export let data: PageData

	let language_select_for_texts: HTMLSelectElement
	let voice_select: HTMLSelectElement
	let speech_to_text_language_select: HTMLSelectElement
	let textarea: HTMLTextAreaElement

	// eslint-disable-next-line no-undef
	let synth: SpeechSynthesis
	// eslint-disable-next-line no-undef
	let voices: SpeechSynthesisVoice[] = []

	function set_languages_for_texts(): void {
		const json = JSON.parse(data.languages_json_string)
		const language_skeltons: Language[] = []
		const languages = Object.assign(language_skeltons, json) as Language[]

		languages.forEach((language) => {
			const option = document.createElement('option')

			option.textContent = `${language.name} (${language.code})`

			option.setAttribute('data-code', language.code)
			option.setAttribute('data-name', language.name)

			language_select_for_texts.appendChild(option)
		})
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

	function speech(text: string, voice_name: string): void {
		const utterance = new SpeechSynthesisUtterance(text)

		voices.find((voice) => {
			if (voice.name === voice_name) {
				utterance.voice = voice
			}
		})

		utterance.rate = 1
		utterance.pitch = 1
		utterance.volume = 1

		speechSynthesis.speak(utterance)
	}

	function text_to_speech(): void {
		const selected_voice_name = voice_select.selectedOptions[0].getAttribute('data-name') ?? ''

		speech(textarea.value, selected_voice_name)
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
		recognition.interimResults = false
		recognition.maxAlternatives = 1

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		recognition.onresult = (event: any): void => {
			const result = event.results[0][0].transcript
			textarea.value = result
		}

		recognition.start()
	}

	function speech_to_text(): void {
		const selected_language =
			speech_to_text_language_select.selectedOptions[0].getAttribute('data-lang') ?? ''

		recognition(selected_language)
	}

	onMount(() => {
		if (browser) {
			set_languages_for_texts()

			synth = window.speechSynthesis
			synth.onvoiceschanged = populate_voice_list

			setTimeout(() => {
				populate_voice_list()
			}, 10)
		}
	})
</script>

<h1>Welcome to Talk</h1>
<p>
	Visit <a href="https://github.com/sinProject-Inc/talk">https://github.com/sinProject-Inc/talk</a> to
	read the documentation
</p>

<select bind:this={language_select_for_texts} />

<br />
<br />

<textarea placeholder="Enter text" size="60" value="Hello world!" bind:this={textarea} />
<select bind:this={voice_select} />
<button on:click={text_to_speech}>Text-to-Speech</button>

<br />
<br />

<select bind:this={speech_to_text_language_select} />
<button on:click={speech_to_text}>Speech-to-Text</button>

<br /><br />

<style>
	textarea {
		width: 100%;
		height: 100px;
	}
</style>
