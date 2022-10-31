<script lang="ts">
	// import { onMount } from "svelte";

	let recognition_textarea: HTMLTextAreaElement;
	let english_textarea: HTMLTextAreaElement;
	let japanese_textarea: HTMLTextAreaElement;
	// let language_selector: HTMLSelectElement

	// function getVoices() {
	// 	const voices = speechSynthesis.getVoices()

	// 	voices.forEach((voice) => {
	// 		const option = document.createElement('option')
	// 		option.value = voice.name
	// 		option.innerText = `${voice.name} ${voice.lang}`
	// 		language_selector.appendChild(option)
	// 	})

	// 	language_selector = language_selector
	// }

	function speech(text: string, lang: string): void {
		const utterance = new SpeechSynthesisUtterance();

		utterance.text = text;
		utterance.lang = lang;
		utterance.rate = 1;
		utterance.pitch = 1;
		utterance.volume = 1;

		speechSynthesis.speak(utterance);
	}

	function speechInEnglish(): void {
		speech(english_textarea.value, 'en-US');
	}

	function speechInJapanese(): void {
		speech(japanese_textarea.value, 'ja-JP');
	}

	function recognition(lang: string): void {
		if (!('webkitSpeechRecognition' in window)) {
			recognition_textarea.value = 'Speech Recognition Not Available'
			return
		}

		recognition_textarea.value = 'Recognition...'

		const speech_recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognition = new speech_recognition();

		recognition.lang = lang;
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		recognition.onresult = (event: any): void => {
			const result = event.results[0][0].transcript;
			recognition_textarea.value = result;
		};

		recognition.start();
	}

	function recognitionInEnglish(): void {
		recognition('en-US');
	}

	function recognitionInJapanese(): void {
		recognition('ja-JP');
	}



	// onMount(() => {
	// 	getVoices()
	// })
</script>

<h1>Welcome to Talk</h1>
<p>
	Visit <a href="https://github.com/sinProject-Inc/talk">https://github.com/sinProject-Inc/talk</a> to
	read the documentation
</p>

<!-- <select bind:this={language_selector}></select> -->

Speech Recognition
<textarea
	readonly
	placeholder="Press the button and say something"
	size="60"
	bind:this={recognition_textarea}
/>
<button on:click={recognitionInEnglish}>English</button>
<button on:click={recognitionInJapanese}>Japanese</button>

<br /><br />

English
<textarea
	placeholder="Enter text to speech in English"
	size="60"
	value="Hello world!"
	bind:this={english_textarea}
/>
<button on:click={speechInEnglish}>Text-to-Speech</button>

<br /><br />

Japanese
<textarea
	placeholder="Enter text to speech in Japanese"
	size="60"
	value="こんにちは、世界"
	bind:this={japanese_textarea}
/>
<button on:click={speechInJapanese}>Text-to-Speech</button>

<style>
	textarea {
		width: 100%;
		height: 100px;
	}
</style>
