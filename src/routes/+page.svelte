<script lang="ts">
	import { browser } from '$app/environment'
	import type { PageData } from '.svelte-kit/types/src/routes/$types'
	import type { Language, Text } from '@prisma/client'
	import { onMount } from 'svelte'

	export let data: PageData

	let language_select_for_texts: HTMLSelectElement
	let text_select: HTMLSelectElement
	let voice_select: HTMLSelectElement
	let speech_to_text_language_select: HTMLSelectElement
	let textarea: HTMLTextAreaElement

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

			option.textContent = `${language.name} (${language.code})`

			option.setAttribute('data-code', language.code)
			option.setAttribute('data-name', language.name)

			language_select_for_texts.appendChild(option)
		})
	}

	function remove_all_child_nodes(parent: HTMLElement): void {
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild)
		}
	}

	async function fetch_texts(language_code: string): Promise<void> {
		const response = await fetch(`/api/text?language_code=${language_code}`)

		const texts = (await response.json()) as Text[]

		remove_all_child_nodes(text_select)

		const option = document.createElement('option')
		option.textContent = '(select a text)'
		text_select.appendChild(option)

		texts.forEach((text) => {
			const option = document.createElement('option')

			option.textContent = text.text

			text_select.appendChild(option)
		})

		text_select = text_select
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

	function on_change_text_select(): void {
		const language_code =
			language_select_for_texts.selectedOptions[0].getAttribute('data-code') ?? ''
		
			selected_text = text_select.selectedOptions[0].textContent ?? ''
			translated_text = ''
		
		// const voice_name = language_code === 'ja-JP' ? 'Google 日本語' : 'Google US English'

		// speech(selected_text, language_code, voice_name)
	}

	onMount(() => {
		if (!browser) return

		set_languages_for_texts()

		language_select_for_texts.onchange = on_change_language_select_for_texts
		on_change_language_select_for_texts()

		// text_select.onchange = on_change_text_select
		text_select.onchange = on_change_text_select

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

		translated_text = await response.json() as string
	}
</script>

<h1>Talk</h1>

<select bind:this={language_select_for_texts} />

<br />
<select class="texts" bind:this={text_select} />

{#if selected_text}
	{@const encoded_text = encodeURIComponent(selected_text)}
	<audio src="/api/text-to-speech/{encoded_text}" controls autoplay />
{/if}

<button on:click={translate}>Translate</button>

{translated_text}

<!-- <button on:click={on_change_text_select}>Speech Selected Text</button> -->

<br />
<br />

<textarea placeholder="Enter text" size="60" value="Hello world!" bind:this={textarea} />
<select bind:this={voice_select} />
<button on:click={text_to_speech}>Text-to-Speech</button>

<br />
<br />

<select bind:this={speech_to_text_language_select} />
<button on:click={speech_to_text}>Speech-to-Text</button>

<!-- <input type="text" bind:this={search_text} /> -->

<br /><br />

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
