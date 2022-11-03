<script lang="ts">
	import { browser } from '$app/environment'
	import { onMount } from 'svelte'

	let voice_select: HTMLSelectElement
	let language_select: HTMLSelectElement
	let textarea: HTMLTextAreaElement

	// eslint-disable-next-line no-undef
	let synth: SpeechSynthesis
	// eslint-disable-next-line no-undef
	let voices: SpeechSynthesisVoice[] = []

	function populate_voice_list(): void {
		voices = synth.getVoices()
		console.log(voices)

		const lang_set: Set<string> = new Set()

		voices.forEach((voice) => {
			const option = document.createElement('option')
			const default_text = voice.default ? ' -- DEFAULT' : ''

			option.textContent = `${voice.name} (${voice.lang}) ${default_text}`

			option.setAttribute('data-lang', voice.lang)
			option.setAttribute('data-name', voice.name)

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

			language_select.appendChild(option)
		})

		voice_select = voice_select
		language_select = language_select
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
		const selected_language = language_select.selectedOptions[0].getAttribute('data-lang') ?? ''

		recognition(selected_language)
	}

	onMount(() => {
		if (browser) {
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

<textarea placeholder="Enter text" size="60" value="Hello world!" bind:this={textarea} />
<select bind:this={voice_select} />
<button on:click={text_to_speech}>Text-to-Speech</button>

<br />
<br />

<select bind:this={language_select} />
<button on:click={speech_to_text}>Speech-to-Text</button>

<br /><br />

<style>
	textarea {
		width: 100%;
		height: 100px;
	}
</style>
