<script lang="ts">
	import { version } from '$app/environment'
	import type { ChatMember, MessageSet } from '$lib/chat/chat'
	import FillIcon from '$lib/components/icons/fill_icon.svelte'
	import NotificationsActiveIcon from '$lib/components/icons/notifications_active_icon.svelte'
	import NotificationsIcon from '$lib/components/icons/notifications_icon.svelte'
	import PersonIcon from '$lib/components/icons/person_icon.svelte'
	import SignInIcon from '$lib/components/icons/sign_in_icon.svelte'
	import SignOutIcon from '$lib/components/icons/sign_out_icon.svelte'
	import StopIcon from '$lib/components/icons/stop_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import Navbar from '$lib/components/navbar.svelte'
	import { AppLocalStorage } from '$lib/locale/app_local_storage'
	import { LocaleCode } from '$lib/locale/locale_code'
	import { SpeechDivElement } from '$lib/speech/speech_div_element'
	import { SpeechText } from '$lib/speech/speech_text'
	import { WebSpeechRecognition } from '$lib/speech/web_speech_recognition'
	import { GetTranslationApi } from '$lib/translation/get_translation_api'
	import { Direction } from '$lib/view/direction'
	import { EventKey } from '$lib/view/event_key'
	import { LocaleSelectElement } from '$lib/view/locale_select_element'
	import { Web } from '$lib/view/web'
	import type { ChatLog, Locale } from '@prisma/client'
	import { io } from 'socket.io-client'
	import { onMount } from 'svelte'
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import type { PageData } from './$types'

	type ChatLogItem = {
		data: ChatLog
		translated: string
	}

	export let data: PageData

	let locale_select_element: HTMLSelectElement
	let chat_log_div_element: HTMLDivElement

	let name_element: HTMLInputElement
	let message_div_element: HTMLDivElement

	let locales: Locale[] = []
	let name = ''
	let message = ''
	let chat_log_items: ChatLogItem[] = []

	let web_speech_recognition: WebSpeechRecognition | undefined
	let listening = false

	let is_visible = true
	let is_notification_enabled = false

	let joined = false
	let chat_members: ChatMember[] = []

	$: can_send = !!name && !!message

	const socket = io()

	async function show_log_translation(chat_log_item: ChatLogItem): Promise<void> {
		// TODO: English-US から GB への翻訳を考慮する

		const speech_text = new SpeechText(chat_log_item.data.message)
		const source_locale_code = new LocaleCode(chat_log_item.data.locale_code)
		const target_locale_code = new LocaleCode(locale_select_element.value)

		const translated_texts = await new GetTranslationApi(
			speech_text,
			source_locale_code,
			target_locale_code
		).fetch()

		chat_log_item.translated = translated_texts[0]?.text ?? ''
	}

	async function show_translation(): Promise<void> {
		const locale_code = locale_select_element.value
		const items_for_translating = chat_log_items.filter((chat_log_item) => {
			if (chat_log_item.translated) return false
			if (chat_log_item.data.locale_code === locale_code) return false

			return true
		})

		const promises: Promise<void>[] = []

		items_for_translating.forEach((chat_log_item) => {
			promises.push(show_log_translation(chat_log_item))
		})

		await Promise.all(promises)

		chat_log_items = chat_log_items
	}

	function show_notification(notification_message: string): void {
		if (!is_notification_enabled) return
		if (is_visible) return

		navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => {
			console.info('notification_message', notification_message)

			registration.showNotification('sinProject Talk - Chat', {
				body: notification_message,
				icon: '/icon-192.png',
			})
		})
	}

	function show_message_notification(translated_chat_log: {
		data: ChatLog
		translated: string
	}): void {
		const notification_message = translated_chat_log.translated || translated_chat_log.data.message

		show_notification(notification_message)
	}

	function scroll_to_bottom(): void {
		setTimeout(() => {
			chat_log_div_element.scrollTop = chat_log_div_element.scrollHeight
		}, 10)
	}

	async function send(): Promise<void> {
		name = name.trim()
		message = message.trim()

		if (!name) {
			name_element.focus()
			return
		}

		if (!message) {
			message_div_element.focus()
			return
		}

		const message_set: MessageSet = {
			locale_code: locale_select_element.value,
			name,
			message,
		}

		// console.info(`socket.io send: ${message}`)
		socket.emit('message', message_set)
	}

	function on_keydown_name(event: KeyboardEvent): void {
		const event_key = new EventKey(event)

		if (!event_key.is_enter) return
		if (!name) return

		event.preventDefault()
		join()
	}

	function on_keydown_message(event: KeyboardEvent): void {
		const event_key = new EventKey(event)

		if (!event_key.is_enter) return

		event.preventDefault()
		send()
	}

	async function set_app_locale(): Promise<void> {
		const locale_code = new LocaleCode(locale_select_element.value)

		$locale = locale_code.code

		await waitLocale($locale)
	}

	function init_name(): void {
		name = AppLocalStorage.instance.name
	}

	async function init_locale(): Promise<void> {
		locales = JSON.parse(data.locales) as Locale[]

		new LocaleSelectElement(locale_select_element, locales).append_options_long()

		locale_select_element.value = AppLocalStorage.instance.to_locale
		await set_app_locale()
	}

	function init_focus(): void {
		name_element.focus()
	}

	async function on_change_locale_select(): Promise<void> {
		AppLocalStorage.instance.to_locale = locale_select_element.value
		await set_app_locale()

		chat_log_items.forEach((chat_log_item) => (chat_log_item.translated = ''))

		await show_translation()
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

	function move_caret_to_end(): void {
		const range = document.createRange()
		const selection = window.getSelection()

		range.selectNodeContents(message_div_element)
		range.collapse(false)

		selection?.removeAllRanges()
		selection?.addRange(range)
	}

	function on_end_listening(): void {
		listening = false
		message = message_div_element.textContent || ''

		move_caret_to_end()
	}

	function start_listening(): void {
		const locale_code = new LocaleCode(locale_select_element.value)
		const speech_text_element = new SpeechDivElement(message_div_element)

		web_speech_recognition = new WebSpeechRecognition(
			locale_code,
			speech_text_element,
			on_end_listening
		)

		listening = true

		web_speech_recognition.start_continuous()
	}

	function stop_listening(): void {
		if (!web_speech_recognition) return

		web_speech_recognition.stop()

		on_end_listening()
	}

	// function send_test_notification(): void {
	// 	const title = 'Talk - Chat'
	// 	const body = '通知テストです'
	// 	const icon = '/icon-144.png'
	// 	const options = { body, icon }
	// 	const notification = new Notification(title, options)

	// 	console.log('send_notification')

	// 	setTimeout(send_test_notification, 30 * 1000)

	// 	// 	notification.onclick = () => {
	// 	// 		console.log('notification.onclick')
	// 	// 	}

	// 	// 	notification.onclose = () => {
	// 	// 		console.log('notification.onclose')
	// 	// 	}

	// 	// 	notification.onerror = () => {
	// 	// 		console.log('notification.onerror')
	// 	// 	}

	// 	// 	notification.onshow = () => {
	// 	// 		console.log('notification.onshow')
	// 	// 	}
	// }

	async function enable_notification(): Promise<void> {
		const notification_permission = await Notification.requestPermission()

		if (notification_permission !== 'granted') {
			alert($_('please_allow_notification'))
			return
		}

		is_notification_enabled = true
	}

	async function disable_notification(): Promise<void> {
		is_notification_enabled = false
	}

	function add_checking_background_events(): void {
		document.addEventListener('visibilitychange', () => {
			is_visible = document.visibilityState === 'visible'
		})

		window.addEventListener('focus', () => {
			is_visible = true
		})

		window.addEventListener('blur', () => {
			is_visible = false
		})
	}

	type JoinData = {
		room_id: string
		name: string
		locale_code: string
	}

	function join(): void {
		if (!name) {
			name_element.focus()
			return
		}

		// TODO: RoomId を指定する
		const join_data: JoinData = {
			room_id: 'room01',
			name: name,
			locale_code: locale_select_element.value,
		}

		socket.emit('join', join_data)

		joined = true

		setTimeout(() => {
			message_div_element.focus()
		}, 50)
	}

	function leave(): void {
		// TODO: leave
		socket.emit('leave')

		chat_log_items = []
		joined = false

		setTimeout(() => {
			name_element.focus()
		}, 50)
	}

	// function register_service_worker(): void {
	// 	if (!browser) return

	// 	navigator.serviceWorker.register('/service-worker.js', {
	// 		type: dev ? 'module' : 'classic',
	// 	})
	// }

	function get_country_emoji(locale_code: LocaleCode): string {
		const locale = locales.find((locale) => locale.code === locale_code.code)

		if (!locale) return ''

		return locale.emoji
	}

	socket.on('connect', () => {
		console.debug('[socket.io] connected.')
	})

	socket.on('disconnect', () => {
		console.debug('[socket.io] disconnected.')
	})

	socket.on('logs', async (received_chat_logs: ChatLog[]) => {
		const received_chat_log_items = received_chat_logs.map((chat_log) => {
			return {
				data: chat_log,
				translated: '',
			}
		})

		chat_log_items = received_chat_log_items.slice().reverse()

		await show_translation()
		scroll_to_bottom()
	})

	socket.on('message', async (received_chat_log: ChatLog) => {
		const translated_chat_log = {
			data: received_chat_log,
			translated: '',
		}

		const is_at_bottom =
			chat_log_div_element.scrollHeight - chat_log_div_element.scrollTop ===
			chat_log_div_element.clientHeight

		chat_log_items = [...chat_log_items, translated_chat_log]

		await show_translation()
		show_message_notification(translated_chat_log)

		if (is_at_bottom || Web.is_android()) {
			scroll_to_bottom()
		}

		// TODO: 厳密同一人物チェックが必要
		if (received_chat_log.name !== name) return
		if (received_chat_log.message !== message) return

		message = ''
	})

	socket.on('members', (members: ChatMember[]) => {
		chat_members = members
	})

	socket.on('join', (member: ChatMember) => {
		console.debug('join', member.name)
		const notification_message = $_('joined', { values: { name: member.name } })

		setTimeout(() => {
			show_notification(notification_message)
		}, 50)
	})

	socket.on('leave', (member: ChatMember) => {
		console.debug('leave', member.name)
		const notification_message = $_('leaved', { values: { name: member.name } })

		setTimeout(() => {
			show_notification(notification_message)
		}, 50)
	})

	onMount(async () => {
		add_checking_background_events()
		init_name()
		await init_locale()
		init_focus()
		// register_service_worker()
	})
</script>

<svelte:head>
	<title>Talk - Chat</title>
</svelte:head>

<div class="flex flex-col h-screen min-h-screen">
	<Navbar />

	<div class="flex-1 flex flex-col gap-3 p-3 center-container w-screen overflow-y-scroll">
		{#if joined}
			<div
				class="flex-1 overflow-y-scroll glass-panel p-3 flex flex-col gap-3"
				bind:this={chat_log_div_element}
			>
				{#each chat_log_items as chat_log_item}
					<div>
						<div class="flex flex-row gap-1">
							<span class="font-bold" data-testid="chat_name">{chat_log_item.data.name}</span>
							<span class="text-white/50">{to_local_time(chat_log_item.data.created_at)}</span>
						</div>
						{#if chat_log_item.translated}
							<p>
								<span data-testid="translated_chat_message">{chat_log_item.translated}</span>
							</p>
							<div class="flex flex-row gap-1 text-white/50">
								<span>{chat_log_item.data.locale_code}:</span>
								<span
									data-testid="chat_message"
									lang={chat_log_item.data.locale_code}
									dir={new Direction(chat_log_item.data.locale_code).value}
									>{chat_log_item.data.message}</span
								>
							</div>
						{:else}
							<p>
								<span data-testid="chat_message">{chat_log_item.data.message}</span>
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<div class="p-3 glass-panel flex flex-col gap-3">
			{#if joined}
				<div class="flex flex-row flex-wrap gap-3">
					<div class="flex flex-row flex-wrap gap-0.5">
						<span class="w-[24px] h-[24px]">
							<PersonIcon />
						</span>
						{chat_members.length}
					</div>
					{#each chat_members as chat_member}
						{@const locale_code = new LocaleCode(chat_member.locale_code)}
						<div class="flex flex-row flex-wrap gap-1">
							<span>{get_country_emoji(locale_code)}</span>
							<span>{chat_member.name}</span>
						</div>
					{/each}
				</div>

				<div class="input flex flex-col gap-1 p-1">
					<div
						contenteditable="true"
						class="outline-none px-3 py-1"
						placeholder={$_('enter_new_text')}
						bind:this={message_div_element}
						bind:textContent={message}
						on:keydown={on_keydown_message}
					/>
					<div class="flex flex-row">
						<div class="flex-1">
							{#if listening}
								<IconButton on_click_handler={stop_listening}>
									<StopIcon />
								</IconButton>
							{:else}
								<IconButton on_click_handler={start_listening}>
									<VoiceIcon />
								</IconButton>
							{/if}
						</div>
						<div>
							<IconButton on_click_handler={send} enabled={can_send}><FillIcon /></IconButton>
						</div>
					</div>
				</div>
			{/if}

			<div class="flex gap-3 items-center flex-wrap">
				<select
					class="glass-button text-center"
					bind:this={locale_select_element}
					on:change={on_change_locale_select}
					disabled={joined}
				/>

				<input
					class="grow"
					type="text"
					bind:this={name_element}
					bind:value={name}
					placeholder={$_('name')}
					on:keydown={on_keydown_name}
					on:change={on_change_name}
					disabled={joined}
				/>

				{#if joined}
					{#if is_notification_enabled}
						<button class="glass-button" on:click={disable_notification}>
							<div class="flex flex-row items-center gap-1.5">
								<div class="w-[24px] h-[24px]">
									<NotificationsActiveIcon />
								</div>
							</div>
						</button>
					{:else}
						<button class="glass-button" on:click={enable_notification}>
							<div class="flex flex-row items-center gap-1.5">
								<div class="w-[24px] h-[24px]">
									<NotificationsIcon />
								</div>
							</div>
						</button>
					{/if}

					<button class="glass-button" on:click={leave}>
						<div class="flex flex-row items-center gap-1.5">
							<div class="w-[24px] h-[24px]">
								<SignOutIcon />
							</div>
						</div>
					</button>
				{:else}
					<button class="glass-button" on:click={join}>
						<div class="flex flex-row items-center gap-1.5">
							<div class="w-[24px] h-[24px]">
								<SignInIcon />
							</div>
						</div>
					</button>
				{/if}
			</div>
		</div>

		<div class="flex justify-center text-white/75 text-sm">
			<a target="_blank" rel="noreferrer" href="https://github.com/sinProject-Inc/talk/"
				>sinProject Talk {version}</a
			>
		</div>
	</div>
</div>
