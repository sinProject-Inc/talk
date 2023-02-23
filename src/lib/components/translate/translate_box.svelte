<script lang="ts">
	import CloseIcon from '$lib/components/icons/close_icon.svelte'
	import CopyIcon from '$lib/components/icons/copy_icon.svelte'
	import SpeakerIcon from '$lib/components/icons/speaker_icon.svelte'
	import StopIcon from '$lib/components/icons/stop_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import { LocaleCode } from '$lib/language/locale_code'
	import { EventKey } from '$lib/view/event_key'
	import type { Text } from '@prisma/client'
	import { createEventDispatcher } from 'svelte'

	export let locale_code = LocaleCode.english_united_states
	export let listening = false
	export let partner_listening = false

	let textarea_element: HTMLTextAreaElement
	let value: string

	const dispatch = createEventDispatcher()

	$: button_enabled = (): boolean => {
		if (partner_listening) return false

		if (!value) return false
		if (listening) return false

		return true
	}

	$: listening_button_enabled = (): boolean => {
		if (partner_listening) return false

		return true
	}

	async function handle_listen_button(): Promise<void> {
		if (listening) {
			listening = false
			dispatch('stop_listening')
			return
		} else {
			listening = true
			dispatch('start_listening')
		}
	}

	export function set_text(new_text: Text): void {
		value = new_text.text
	}

	function on_textarea_keydown(event: KeyboardEvent): void {
		const event_key = new EventKey(event)

		if (event_key.is_enter) {
			event.preventDefault()
			dispatch('keydown_enter')
		}
	}

	function copy(): void {
		navigator.clipboard.writeText(value)
		dispatch('copy')
	}

	export function clear(): void {
		value = ''
	}

	export function focus(): void {
		textarea_element.focus()
	}

	export function get_value(): string {
		value = textarea_element.value
		return value
	}

	export function set_value(value_arg: string): void {
		value = value_arg
	}

	export function get_textarea_element(): HTMLTextAreaElement {
		return textarea_element
	}
</script>

<div class="main-box glass-panel row-span-1">
	<div class="grid h-full -mb-11 pb-11">
		<div class="z-10 flex justify-end pr-[24px] pt-1" style="grid-area: 1/8/1/9">
			<div class="w-5" data-testid="delete_button">
				<IconButton on_click_handler={() => {clear(); focus()}} enabled={button_enabled()}>
					<CloseIcon />
				</IconButton>
			</div>
		</div>
		<textarea
			class="text-area pr-8 resize-none rounded-t-md border-0 outline-none outline-0 focus:outline-none"
			style="grid-area: 1/1/10/9"
			lang={locale_code.code}
			bind:this={textarea_element}
			on:keydown={on_textarea_keydown}
			bind:value={value}
		/>
	</div>
	<div class="flex rounded-b-md p-1">
		<div class="mr-auto flex gap-1">
			<div class="listen-button">
				<IconButton on_click_handler={handle_listen_button} enabled={listening_button_enabled()}>
					{#if listening}
						<StopIcon />
					{:else}
						<VoiceIcon />
					{/if}
				</IconButton>
			</div>
			<div data-testid="tts_button">
				<IconButton on_click_handler={() => dispatch('speak')} enabled={button_enabled()}>
					<SpeakerIcon />
				</IconButton>
			</div>
		</div>
		<div data-testid="copy_button">
			<IconButton on_click_handler={copy} enabled={button_enabled()}>
				<CopyIcon />
			</IconButton>
		</div>
	</div>
</div>
