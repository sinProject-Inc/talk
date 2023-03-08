<script lang="ts">
	import { version } from '$app/environment'
	import FillIcon from '$lib/components/icons/fill_icon.svelte'
	import NotificationIcon from '$lib/components/icons/notification_icon.svelte'
	import StopIcon from '$lib/components/icons/stop_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import Navbar from '$lib/components/navbar.svelte'
	import { AppLocaleCode } from '$lib/language/app_locale_code'
	import { AppLocalStorage } from '$lib/language/app_local_storage'
	import { LocaleCode } from '$lib/language/locale_code'
	import { SpeechDivElement } from '$lib/speech/speech_div_element'
	import { SpeechLanguageCode } from '$lib/speech/speech_language_code'
	import { SubmissionText } from '$lib/speech/submission_text'
	import { WebSpeechRecognition } from '$lib/speech/web_speech_recognition'
	import { AddTextApi } from '$lib/text/add_text_api'
	import { TextId } from '$lib/text/text_id'
	import { AddTranslationApi } from '$lib/translation/add_translation_api'
	import { FindTranslationsApi } from '$lib/translation/find_translations_api'
	import { TranslateWithGoogleAdvancedApi } from '$lib/translation/translate_with_google_advanced_api'
	import { TranslationText } from '$lib/translation/translation_text'
	import { EventKey } from '$lib/view/event_key'
	import { LocaleSelectElement } from '$lib/view/locale_select_element'
	import { Message } from '$lib/view/message'
	import type { ChatLog, Locale, Text } from '@prisma/client'
	import { io } from 'socket.io-client'
	import { onMount } from 'svelte'
	import { locale, waitLocale, _ } from 'svelte-i18n'
	import type { PageData } from './$types'

	type MessageSet = {
		locale_code: string
		name: string
		message: string
	}

	type ChatLogItem = {
		data: ChatLog
		translated: string
	}

	export let data: PageData

	let locale_select_element: HTMLSelectElement

	let name_element: HTMLInputElement
	let message_div_element: HTMLDivElement

	let locales: Locale[] = []
	let name = ''
	let message = ''
	let chat_log_items: ChatLogItem[] = []

	let web_speech_recognition: WebSpeechRecognition | undefined
	let listening = false

	$: can_send = !!name && !!message

	const socket = io()

	async function add_text(chat_log_item: ChatLogItem): Promise<Text> {
		const locale_code = LocaleCode.create(chat_log_item.data.locale_code)
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

		const submission_text = new SubmissionText(chat_log_item.data.message)
		const text = await new AddTextApi(speech_language_code, submission_text).fetch()

		return text
	}

	async function find_translation(text: Text, locale_code: LocaleCode): Promise<Text[]> {
		const text_id = new TextId(text.id)
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)

		const translation_texts = await new FindTranslationsApi(text_id, speech_language_code).fetch()

		return translation_texts
	}

	async function add_translation(text: Text, locale_code: LocaleCode): Promise<Text> {
		const translation_text = new TranslationText(text.text)
		const speech_language_code = SpeechLanguageCode.create_from_locale_code(locale_code)
		const app_local_code = AppLocaleCode.from_speech_language_code(speech_language_code)

		const translated_text = await new TranslateWithGoogleAdvancedApi(
			translation_text,
			app_local_code
		).fetch()

		const text_id = new TextId(text.id)
		const added_text = await new AddTranslationApi(
			text_id,
			speech_language_code,
			translated_text
		).fetch()

		return added_text
	}

	async function show_log_translation(chat_log_item: ChatLogItem): Promise<void> {
		// TODO: English-US から GB への翻訳を考慮する

		const text = await add_text(chat_log_item)

		if (!text) return

		const target_locale_code = LocaleCode.create(locale_select_element.value)
		const translation_texts = await find_translation(text, target_locale_code)

		if (translation_texts.length > 0) {
			chat_log_item.translated = translation_texts[0].text
			return
		}

		const translation_text = await add_translation(text, target_locale_code)

		chat_log_item.translated = translation_text.text
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

	socket.on('connect', () => {
		console.info('socket.io connected')
	})

	socket.on('disconnect', () => {
		console.info('socket.io disconnected')
	})

	socket.on('logs', async (received_chat_logs: ChatLog[]) => {
		chat_log_items = received_chat_logs.map((chat_log) => {
			return {
				data: chat_log,
				translated: '',
			}
		})

		await show_translation()
	})

	socket.on('message', async (received_chat_log: ChatLog) => {
		const translated_chat_log = {
			data: received_chat_log,
			translated: '',
		}

		chat_log_items = [translated_chat_log, ...chat_log_items]

		await show_translation()

		if (received_chat_log.name !== name) return
		if (received_chat_log.message !== message) return

		// TODO: 厳密同一人物チェックが必要
		message = ''
	})

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
		message_div_element.focus()
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
		locales = JSON.parse(data.locales) as Locale[]

		new LocaleSelectElement(locale_select_element, locales).append_options()

		locale_select_element.value = AppLocalStorage.instance.to_locale
		await set_app_locale()
	}

	function init_focus(): void {
		name ? message_div_element.focus() : name_element.focus()
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
		const locale_code = LocaleCode.create(locale_select_element.value)
		const hint_message = new Message($_('recognizing'))
		const speech_text_element = new SpeechDivElement(message_div_element, hint_message)

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

	function handle_listen_button(): void {
		if (listening) {
			stop_listening()
		} else {
			start_listening()
		}
	}

	function send_notification(): void {
		const title = 'Talk - Chat'
		const body = '通知テストです'
		const icon = '/icon-144.png'
		const options = { body, icon }
		const notification = new Notification(title, options)

		console.log('send_notification')

		setTimeout(send_notification, 30 * 1000)

	// 	notification.onclick = () => {
	// 		console.log('notification.onclick')
	// 	}

	// 	notification.onclose = () => {
	// 		console.log('notification.onclose')
	// 	}

	// 	notification.onerror = () => {
	// 		console.log('notification.onerror')
	// 	}

	// 	notification.onshow = () => {
	// 		console.log('notification.onshow')
	// 	}
	}

	async function on_click_notification(): Promise<void> {
		const notification_permission = await Notification.requestPermission()

		console.log(notification_permission)

		if (notification_permission !== 'granted') return

		send_notification()
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
				<button class="glass-button" on:click={on_click_notification}>
					<div class="flex flex-row items-center gap-1.5">
						<div class="w-5 h-5">
							<NotificationIcon />
						</div>
						通知
					</div>
				</button>

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
						<IconButton on_click_handler={handle_listen_button}>
							{#if listening}
								<StopIcon />
							{:else}
								<VoiceIcon />
							{/if}
						</IconButton>
					</div>
					<div>
						<IconButton on_click_handler={send} enabled={can_send}><FillIcon /></IconButton>
					</div>
				</div>
			</div>

			<!-- <div class="flex relative">
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
			</div> -->
		</div>

		<div class="flex-1 overflow-y-scroll glass-panel p-3 flex flex-col gap-3">
			{#each chat_log_items as chat_log_item}
				<div>
					<p>
						<span class="font-bold" data-testid="chat_name">{chat_log_item.data.name}</span>
						<span class="text-white/50">{to_local_time(chat_log_item.data.created_at)}</span>
					</p>
					{#if chat_log_item.translated}
						<p>
							<span data-testid="translated_chat_message">{chat_log_item.translated}</span>
						</p>
						<p class="text-white/50">
							<span>{chat_log_item.data.locale_code}:</span>
							<span data-testid="chat_message">{chat_log_item.data.message}</span>
						</p>
					{:else}
						<p>
							<span data-testid="chat_message">{chat_log_item.data.message}</span>
						</p>
					{/if}
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
