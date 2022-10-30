<script lang="ts">
	import { onMount } from "svelte";


	let english_text_input: HTMLInputElement
	let japanese_text_input: HTMLInputElement
	let language_selector: HTMLSelectElement

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

	function speech(text: string, lang: string) {
		const utterance = new SpeechSynthesisUtterance();

		utterance.text = text;
		utterance.lang = lang;
		utterance.rate = 1;
		utterance.pitch = 1;
		utterance.volume = 1;
		
		speechSynthesis.speak(utterance);
	}

	// onMount(() => {
	// 	getVoices()
	// })
</script>

<h1>Welcome to Talk</h1>
<p>Visit <a href="https://github.com/sinProject-Inc/talk">https://github.com/sinProject-Inc/talk</a> to read the documentation</p>

<!-- <select bind:this={language_selector}></select> -->

<input type="text" placeholder="Enter text to speech in English" size=60 value="Hello world!" bind:this={english_text_input}>
<button on:click={() => speech(english_text_input.value, 'en-US')}>Speech in English</button>

<br><br>

<input type="text" placeholder="Enter text to speech in Japanese" size=60 value="こんにちは、世界" bind:this={japanese_text_input}>
<button on:click={() => speech(japanese_text_input.value, 'ja-JP')}>Speech in Japanese</button>

