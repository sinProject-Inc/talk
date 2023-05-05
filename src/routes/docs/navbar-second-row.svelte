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
	class="md:hidden flex sticky z-10 h-[var(--header-height)] top-[var(--header-height)] backdrop-blur bg-transparent border-b border-slate-50/[0.06] flex-col"
>
	<div class="flex md:hidden w-full h-full items-center center-container">
		<IconButton class="-ml-[10.5px] mr-0" on:click={open_mobile_side_bar}>
			<HamburgerIcon />
		</IconButton>
		<div class="flex items-center gap-3">
			<div>{$current_page_category}</div>
			<div class="w-1 h-1 flex items-center justify-center">
				<RightArrowIcon />
			</div>
			<div class="text-white/90 font-semibold">{$current_page_title}</div>
		</div>
	</div>
</div>
