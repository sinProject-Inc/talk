<script lang="ts">
	import { io } from 'socket.io-client'

	let message = ''
	let messages: string[] = []

	const socket = io()

	socket.on('connect', () => {
		console.info('socket.io connected')
	})

	socket.on('disconnect', () => {
		console.info('socket.io disconnected')
	})

	socket.on('message', (data: string) => {
		console.info(`socket.io message: ${data}`)
		
		messages = [data, ...messages]
	})

	async function send(): Promise<void> {
		console.info(`socket.io send: ${message}`)
		socket.emit('message', message)
	}
</script>

<input type="text" bind:value={message} />
<button on:click={send}>Send</button>

{#each messages as msg}
	<p>{msg}</p>
{/each}
