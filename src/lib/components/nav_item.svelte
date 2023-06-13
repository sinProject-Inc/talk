<script lang="ts">
	import { base } from '$app/paths'
	import { _ } from 'svelte-i18n'
	import BookIcon from './icons/book_icon.svelte'
	import LanguageHiraganaIcon from './icons/language_hiragana_icon.svelte'
	import MessageChatbotIcon from './icons/message_chatbot_icon.svelte'

	export let name: string

	$: text = name === 'docs' ? 'Docs' : $_(name)
</script>

<a href="{base}/{name}" class="flex items-center gap-1" title={text}>
	<div class="h-nav-icon">
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
		@apply hover:text-secondary dark:hover:text-secondary-dark;
	}
</style>
