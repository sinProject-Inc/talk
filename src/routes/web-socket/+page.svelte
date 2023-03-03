<script lang="ts">
	import FillIcon from '$lib/components/icons/fill_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import Navbar from '$lib/components/navbar.svelte'
	import { EventKey } from '$lib/view/event_key'
	import { io } from 'socket.io-client'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'

	type MessageSet = {
		name: string
		message: string
	}

	let name_element: HTMLInputElement
	let message_element: HTMLInputElement

	let name = ''
	let message = ''
	let message_data: MessageSet[] = []

	const socket = io()

	socket.on('connect', () => {
		console.info('socket.io connected')
	})

	socket.on('disconnect', () => {
		console.info('socket.io disconnected')
	})

	socket.on('message', (received_data: MessageSet) => {
		console.info(`socket.io message: ${received_data}`)

		message_data = [received_data, ...message_data]

		if (received_data.name !== name) return
		if (received_data.message !== message) return

		// TODO: 厳密同一人物チェックが必要
		message = ''
	})

	async function send(): Promise<void> {
		console.info(`socket.io send: ${message}`)
		socket.emit('message', { name, message })
	}

	function on_keydown_name(event: KeyboardEvent): void {
		const event_key = new EventKey(event)

		if (!event_key.is_enter) return
		if (!name) return

		event.preventDefault()
		message_element.focus()
	}

	function on_keydown_message(event: KeyboardEvent): void {
		const event_key = new EventKey(event)

		if (!event_key.is_enter) return

		event.preventDefault()
		send()
	}

	onMount(() => {
		name_element.focus()
	})
</script>

<svelte:head>
	<title>Talk - Chat</title>
</svelte:head>

<Navbar />

<div class="center-container w-screen h-[calc(100vh-69px)]">
	<div class="p-4 glass-panel my-4 flex flex-col gap-4 flex-1 overflow-y-scroll">
		<input
			type="text"
			bind:this={name_element}
			bind:value={name}
			placeholder="Name"
			class="w-60"
			on:keydown={on_keydown_name}
		/>
		<div class="flex gap-2 items-center">
			<input
				type="text"
				class="flex-1"
				placeholder={$_('enter_new_text')}
				bind:this={message_element}
				bind:value={message}
				on:keydown={on_keydown_message}
			/>
			<IconButton on_click_handler={send}><FillIcon /></IconButton>
		</div>
		{#each message_data as message_set}
			<p>{message_set.name}: {message_set.message}</p>
		{/each}
	</div>
</div>
