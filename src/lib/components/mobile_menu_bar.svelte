<script lang="ts">
	import IconButton from '$lib/components/icon_button.svelte'
	import CloseIcon from '$lib/components/icons/close_icon.svelte'
	import { mobile_menu_open } from '$lib/stores'
	import MenuItemsSub from './menu_items_sub.svelte'
	import NavItem from './nav_item.svelte'

	function close(): void {
		$mobile_menu_open = false
	}

	function handle_keydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') {
			close()
		}
	}

	/* eslint-disable @typescript-eslint/explicit-function-return-type */
</script>

<svelte:window on:keydown={handle_keydown} />

<div
	class="pointer-events-auto fixed left-0 top-0 z-10 h-screen w-screen"
	on:click={close}
	on:keydown
	role="button"
	tabindex="0"
/>

<div class="pointer-events-none fixed right-0 top-0 z-20 flex h-full justify-center">
	<div
		class="glass-panel pointer-events-auto ml-auto min-h-screen w-80 items-start rounded-none border-0 bg-primary-dark-8/90 pl-10 dark:bg-primary-8/90"
	>
		<div class="side-bar-navigation h-screen w-full overflow-y-scroll">
			<IconButton class="absolute right-6 top-4" on:click={close}>
				<CloseIcon />
			</IconButton>

			<div class="text-sm leading-6">
				<ul class="pl-1 pt-6">
					<li class="my-8">
						<ul class="space-y-2">
							<li>
								<NavItem name="learn" />
							</li>
							<li>
								<NavItem name="translate" />
							</li>
							<li>
								<NavItem name="chat" />
							</li>
						</ul>
					</li>
				</ul>
				<nav
					class="ms-auto mt-12 flex h-full items-center gap-5 pl-1 text-sm font-semibold leading-6"
				>
					<MenuItemsSub />
				</nav>
			</div>
		</div>
	</div>
</div>

<!-- <style lang="postcss">
	.active {
		@apply border-current text-secondary dark:text-secondary-dark;
	}

	.inactive {
		@apply border-transparent text-primary-3 hover:border-primary-2 hover:text-primary-10 dark:text-primary-dark-3 dark:hover:border-primary-dark-2 dark:hover:text-primary-dark-4;
	}
</style> -->
