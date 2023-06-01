<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { base } from '$app/paths'

	const audio_buffers = new Map<string, AudioBuffer>()
	const audio_sources = new Map<string, AudioBufferSourceNode>()

	export let id_paths = new Map([
		['on-mouse-over', `${base}/sound/button-124476.mp3`],
		// ['on-click', `${base}/sound/interface-124464.mp3`],
		['on-click', `${base}/sound/button-124476.mp3`],
	])

	let audio_context: AudioContext

	async function load_audio_buffer_source(id: string): Promise<void> {
		const audio_buffer = audio_buffers.get(id)
		const audio_source = audio_context.createBufferSource()

		if (!audio_buffer) return

		audio_source.buffer = audio_buffer

		const gain_node = audio_context.createGain()

		gain_node.gain.value = 0.1

		audio_source.connect(gain_node)
		gain_node.connect(audio_context.destination)
		// audio_source.connect(audio_context.destination)

		audio_sources.set(id, audio_source)
	}

	async function load_sound(id: string, path: string): Promise<void> {
		const response = await fetch(path)
		const array_buffer = await response.arrayBuffer()
		const audio_buffer = await audio_context.decodeAudioData(array_buffer)

		audio_buffers.set(id, audio_buffer)

		load_audio_buffer_source(id)
	}

	async function load_sounds(): Promise<void> {
		if (!id_paths) return

		for (let [key, value] of id_paths) {
			await load_sound(key, value)
		}
	}

	export async function play_sound(id: string): Promise<void> {
		if (!audio_context) {
			await init_audio_context()
		}

		audio_sources.get(id)?.start(0)
		load_audio_buffer_source(id)
	}

	async function init_audio_context(): Promise<void> {
		try {
			// window.AudioContext = window.AudioContext || window.webkitAudioContext
			audio_context = new AudioContext({ latencyHint: 'interactive' })
			// console.log(`latency: ${audio_context.baseLatency}`)
		} catch (e) {
			alert('Web Audio API is not supported in this browser')
		}

		await load_sounds()
	}

	// async function play_sound_on_on_mouse_enter(event: Event): Promise<void> {
	// 	await play_sound('on-mouse-over')
	// }

	async function play_sound_on_click(): Promise<void> {
		await play_sound('on-click')
	}

	function add_event_listeners(): void {
		const elements = document.querySelectorAll('a, button')
		for (let element of elements) {
			// element.addEventListener('mouseenter', play_sound_on_on_mouse_enter)
			element.addEventListener('click', play_sound_on_click)
		}
	}

	afterNavigate(() => {
		add_event_listeners()
	})
</script>
