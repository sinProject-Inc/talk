<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import HamburgerIcon from '$lib/components/icons/hamburger_icon.svelte'
	import RightArrowIcon from '$lib/components/icons/right_arrow_icon.svelte'
	import { current_page_category, current_page_title } from '$lib/docs/current_page_store'

	const dispatch = createEventDispatcher()

	function open_mobile_side_bar(): void {
		dispatch('open_mobile_side_bar')
	}
</script>

<div
	class="sticky top-[var(--header-height)] z-10 flex h-[var(--header-height)] flex-col border-b border-primary-9/[0.06] bg-transparent backdrop-blur dark:border-primary-dark-9/[0.06] md:hidden"
>
	<div class="center-container flex h-full w-full items-center md:hidden">
		<IconButton class="-ml-[10.5px] mr-0" on:click={open_mobile_side_bar}>
			<HamburgerIcon />
		</IconButton>
		<div class="flex items-center gap-3">
			<div>{$current_page_category}</div>
			<div class="flex h-1 w-1 items-center justify-center">
				<RightArrowIcon />
			</div>
			<div class="glass-text-5 font-semibold">{$current_page_title}</div>
		</div>
	</div>
</div>
