<script lang="ts">
	import { version } from '$app/environment'
	import FillIcon from '$lib/components/icons/fill_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import Navbar from '$lib/components/navbar.svelte'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { AppLocalStorage } from '$lib/language/app_local_storage'
	import { EventKey } from '$lib/view/event_key'
	import { LocaleSelectElement } from '$lib/view/locale_select_element'
	import type { ChatLog, Locale } from '@prisma/client'
	import { io } from 'socket.io-client'
	import { onMount } from 'svelte'
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import type { PageData } from './$types'

	type MessageSet = {
		name: string
		message: string
	}

	export let data: PageData

	let locale_select_element: HTMLSelectElement

	let name_element: HTMLInputElement
	let message_element: HTMLInputElement

	let name = ''
	let message = ''
	let chat_logs: ChatLog[] = []

	$: can_send = !!name && !!message

	const socket = io()

	socket.on('connect', () => {
		console.info('socket.io connected')
	})

	socket.on('disconnect', () => {
		console.info('socket.io disconnected')
	})

	socket.on('logs', (received_chat_logs: ChatLog[]) => {
		chat_logs = received_chat_logs
	})

	socket.on('message', (received_chat_log: ChatLog) => {
		chat_logs = [received_chat_log, ...chat_logs]

		if (received_chat_log.name !== name) return
		if (received_chat_log.message !== message) return

		// TODO: 厳密同一人物チェックが必要
		message = ''
	})

	async function send(): Promise<void> {
		if (!name) {
			name_element.focus()
			return
		}

		if (!message) {
			message_element.focus()
			return
		}

		// console.info(`socket.io send: ${message}`)
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

	async function set_app_locale(): Promise<void> {
		const app_locale_code = new AppLocaleCode(locale_select_element.value)

		$locale = app_locale_code.code
		await waitLocale($locale)
	}

	function init_name(): void {
		name = AppLocalStorage.instance.name
	}

	async function init_locale(): Promise<void> {
		const locales = JSON.parse(data.locales) as Locale[]

		new LocaleSelectElement(locale_select_element, locales).append_options()

		locale_select_element.value = AppLocalStorage.instance.to_locale
		await set_app_locale()
	}

	function init_focus(): void {
		name ? message_element.focus() : name_element.focus()
	}

	async function on_change_locale_select(): Promise<void> {
		AppLocalStorage.instance.to_locale = locale_select_element.value
		await set_app_locale()
	}

	function on_change_name(): void {
		if (!name) return

		AppLocalStorage.instance.name = name
	}

	function to_local_time(created_at?: Date): string {
		if (!created_at) return ''

		const date = new Date(created_at)

		return date.toLocaleString([], { hour12: false, hour: '2-digit', minute: '2-digit' })
	}

	onMount(async () => {
		init_name()
		await init_locale()
		init_focus()
	})
</script>

<svelte:head>
	<title>Talk - Chat</title>
</svelte:head>

<div class="flex flex-col h-screen min-h-screen">
	<Navbar />

	<div class="flex-1 flex flex-col gap-3 p-3 center-container w-screen overflow-y-scroll">
		<div class="p-3 glass-panel flex flex-col gap-3">
			<div class="flex gap-3 items-center flex-wrap">
				<select
					class="glass-button text-center"
					bind:this={locale_select_element}
					on:change={on_change_locale_select}
				/>

				<input
					class="grow"
					type="text"
					bind:this={name_element}
					bind:value={name}
					placeholder={$_('name')}
					on:keydown={on_keydown_name}
					on:change={on_change_name}
				/>
			</div>

			<div class="flex relative">
				<input
					type="text"
					class="flex-1 pr-11"
					placeholder={$_('enter_new_text')}
					bind:this={message_element}
					bind:value={message}
					on:keydown={on_keydown_message}
				/>
				<div class="absolute right-0 top-0 bottom-0 flex items-center">
					<IconButton on_click_handler={send} enabled={can_send}><FillIcon /></IconButton>
				</div>
			</div>
		</div>

		<div class="flex-1 overflow-y-scroll glass-panel p-3 flex flex-col gap-3">
			{#each chat_logs as chat_log}
				<div>
					<p>
						<span class="font-bold" data-testid="chat_name">{chat_log.name}</span>
						<span class="text-white/50">{to_local_time(chat_log.created_at)}</span>
					</p>
					<p data-testid="chat_message">{chat_log.message}</p>
				</div>
			{/each}
		</div>

		<div class="flex justify-center text-white/75 text-sm">
			<a target="_blank" rel="noreferrer" href="https://github.com/sinProject-Inc/talk/"
				>sinProject Talk {version}</a
			>
		</div>
	</div>
</div>
