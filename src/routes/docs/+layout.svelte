<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import Navbar from '$lib/components/navbar.svelte'
	import Snackbar from '$lib/components/snackbar.svelte'
	import { KeyboardShortcutHandler } from '$lib/view/keyboard_shortcut_handler'
	import { WebLogger } from '$lib/view/log/web_logger'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'
	import MobileSideBar from './mobile-side-bar.svelte'
	import NavbarSecondRow from './navbar-second-row.svelte'
	import SearchModale from './search-modale.svelte'
	import SideBar from './side-bar.svelte'

	let search_modale_open = false
	let mobile_side_bar_open = false

	export let data

	$: sections = data?.sections ?? []

	let search_query = ''
	let copied_snackbar_visible = false
	let copied_snackbar_timeout: number | undefined

	const web_logger = new WebLogger('docs')

	function open_search_modale(): void {
		const selection = window.getSelection()

		if (selection?.toString()) {
			search_query = String(selection.toString())
		}

		search_modale_open = true
	}

	function close_search_modale(): void {
		search_modale_open = false
	}

	function open_mobile_side_bar(): void {
		mobile_side_bar_open = true
	}

	function close_mobile_side_bar(): void {
		mobile_side_bar_open = false
	}

	function create_search_shortcut(): void {
		const search_shortcut_params = {
			control: true,
			code: 'KeyK',
		}

		new KeyboardShortcutHandler(search_shortcut_params, handle_search_shortcut)
	}

	function handle_search_shortcut(): void {
		if (search_modale_open) {
			close_search_modale()

			return
		}

		open_search_modale()
	}

	function add_copy_code_event(): void {
		const copy_code_elements = document.querySelectorAll('.copy-code')

		copy_code_elements.forEach((element) => {
			element.addEventListener('click', (event) => {
				if (!event.target) return

				const target_element = event.target as HTMLElement
				let current_element = target_element.parentElement

				while (current_element) {
					if (current_element.classList.contains('code-container')) break

					current_element = current_element.parentElement
				}

				if (!current_element) return

				const code = current_element.querySelector('code')?.textContent ?? ''

				navigator.clipboard.writeText(code)
				web_logger.info('on_copy: ' + code)

				if (copied_snackbar_timeout) clearTimeout(copied_snackbar_timeout)

				copied_snackbar_visible = true
				copied_snackbar_timeout = window.setTimeout(() => {
					copied_snackbar_visible = false
				}, 2000)
			})
		})
	}

	afterNavigate(() => {
		close_mobile_side_bar()
		add_copy_code_event()
	})

	onMount(() => {
		create_search_shortcut()
	})
</script>

<div class="doc-base">
	<Navbar search_bar_enabled on:show_search_modale={open_search_modale} />
	<NavbarSecondRow on:open_mobile_side_bar={open_mobile_side_bar} />

	{#if mobile_side_bar_open}
		<MobileSideBar {sections} on:close={close_mobile_side_bar} />
	{/if}

	{#if search_modale_open}
		<SearchModale on:close={close_search_modale} bind:search_query />
	{/if}

	<div class="max-w-8xl mx-auto min-h-screen">
		<div
			class="fixed mt-12 hidden h-[calc(100vh-3rem-var(--header-height))] overflow-y-auto pe-4 ps-8 md:block md:w-72"
		>
			<SideBar {sections} on:show_search_modale={open_search_modale} />
		</div>
		<div class="py-8 pe-8 ps-12 md:ps-80 xl:pe-80">
			<slot />
		</div>
	</div>

	<Snackbar text={$_('copied')} visible={copied_snackbar_visible} />
</div>
<img class="github-link !hidden" alt="" />

<style lang="postcss">
	:root {
		background: black;
	}
</style>
