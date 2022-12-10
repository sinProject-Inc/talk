			// <!-- <button on:click={on_change_text_select}>Speech Selected Text</button> -->

// // eslint-disable-next-line no-undef
// let synth: SpeechSynthesis
// // eslint-disable-next-line no-undef
// let voices: SpeechSynthesisVoice[] = []

// import { onMount } from "svelte";


// function text_to_speech(): void {
// 	const selected_language_code = voice_select.selectedOptions[0].getAttribute('data-lang') ?? ''
// 	const selected_voice_name = voice_select.selectedOptions[0].getAttribute('data-name') ?? ''

// 	speech(textarea.value, selected_language_code, selected_voice_name)
// }

// function populate_voice_list(): void {
// 	voices = synth.getVoices()

// 	const lang_set: Set<string> = new Set()

// 	voices.sort((a, b) => {
// 		const a_name = a.lang + a.name
// 		const b_name = b.lang + b.name

// 		if (a_name < b_name) return -1
// 		if (a_name == b_name) return 0
// 		return +1
// 	})

// 	voices.forEach((voice) => {
// 		const option = document.createElement('option')
// 		const default_text = voice.default ? ' -- DEFAULT' : ''

// 		option.textContent = `${voice.lang} (${voice.name}) ${default_text}`

// 		option.setAttribute('data-lang', voice.lang)
// 		option.setAttribute('data-name', voice.name)

// 		if (voice.default) {
// 			option.setAttribute('selected', 'selected')
// 		}

// 		voice_select.appendChild(option)

// 		lang_set.add(voice.lang)
// 	})

// 	const language_array = Array.from(lang_set)

// 	language_array.sort()

// 	language_array.forEach((lang) => {
// 		const option = document.createElement('option')
// 		option.textContent = lang
// 		option.setAttribute('data-lang', lang)
// 		option.setAttribute('data-name', lang)

// 		// TODO: 変更
// 		if (lang === 'en-US') {
// 			option.setAttribute('selected', 'selected')
// 		}

// 		speech_to_text_language_select.appendChild(option)
// 	})

// 	voice_select = voice_select
// 	speech_to_text_language_select = speech_to_text_language_select
// }

// function speech(text: string, language_code: string, voice_name: string): void {
// 	const utterance = new SpeechSynthesisUtterance(text)

// 	utterance.lang = language_code
// 	// search_text.value = language_code

// 	voices.find((voice) => {
// 		if (voice.name === voice_name) {
// 			utterance.voice = voice
// 			// console.log(voice)
// 		}
// 	})

// 	utterance.rate = 1
// 	utterance.pitch = 1
// 	utterance.volume = 1

// 	speechSynthesis.cancel()
// 	speechSynthesis.speak(utterance)
// }

// onMount() {
// 			synth = window.speechSynthesis
// 		synth.onvoiceschanged = populate_voice_list
		// setTimeout(() => {
		// 	populate_voice_list()
		// }, 10)
// }