<script lang="ts">
	import { base } from '$app/paths'
	import { _ } from 'svelte-i18n'
	import BookIcon from './icons/book_icon.svelte'
	import LanguageHiraganaIcon from './icons/language-hiragana_icon.svelte'
	import MessageChatbotIcon from './icons/message-chatbot_icon.svelte'

	export let name: string

	const text = name === 'docs' ? 'Docs' : $_(name)
</script>

<a href="{base}/{name}" class="flex items-center gap-1">
	<div class="h-5">
		{#if name === 'translate'}
			<LanguageHiraganaIcon />
		{:else if name === 'chat'}
			<MessageChatbotIcon />
		{:else if name === 'docs'}
			<BookIcon />
		{/if}
	</div>
	<span class="hidden md:block">{text}</span>
</a>

<style lang="postcss">
	a {
		@apply hover:text-sky-500 dark:hover:text-sky-400;
	}
</style>
