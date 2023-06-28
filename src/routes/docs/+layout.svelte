<script lang="ts">
	import { browser } from '$app/environment'
	import { afterNavigate, beforeNavigate } from '$app/navigation'
	import Navbar from '$lib/components/navbar.svelte'
	import Snackbar from '$lib/components/snackbar.svelte'
	import { animations_enabled, is_min_width_768 } from '$lib/stores'
	import { KeyboardShortcutHandler } from '$lib/view/keyboard_shortcut_handler'
	import { WebLogger } from '$lib/view/log/web_logger'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'
	import { fly } from 'svelte/transition'
	import Vivus from 'vivus'
	import Audio from './audio.svelte'
	import MobileDocsSideBar from './mobile_docs_side_bar.svelte'
	import NavbarSecondRow from './navbar_second_row.svelte'
	import SearchModale from './search_modale.svelte'
	import SideBar from './side_bar.svelte'

	let search_modale_open = false
	let mobile_docs_side_bar_open = false

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

	function open_mobile_docs_side_bar(): void {
		mobile_docs_side_bar_open = true
	}

	function close_mobile_docs_side_bar(): void {
		mobile_docs_side_bar_open = false
	}

	function create_search_shortcut(): void {
		const search_shortcut_params = {
			control: true,
			code: 'KeyK',
		}

		new KeyboardShortcutHandler(search_shortcut_params, handle_search_shortcut)
	}

	let search_modale: SearchModale

	function handle_search_shortcut(): void {
		if (search_modale_open && search_modale) {
			search_modale.close()

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

	let svg_elements: SVGSVGElement[] = []
	let svg_observers: IntersectionObserver[] = []
	let vivus_instances: Vivus[] = []

	async function connect_vivus(): Promise<void> {
		document.querySelectorAll('svg').forEach((svg_element) => {
			svg_elements.push(svg_element)
		})

		svg_elements.forEach((svg_element, index) => {
			const vivus = new Vivus(svg_element as unknown as HTMLElement, {
				duration: 150,
				animTimingFunction: Vivus.EASE_OUT,
			})

			vivus_instances.push(vivus)

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							vivus_instances[index].play()
						} else {
							vivus_instances[index].stop()
							vivus_instances[index].reset()
						}
					})
				},
				{ rootMargin: '-0px', threshold: 0.5 }
			)

			observer.observe(svg_element)
			svg_observers.push(observer)
		})
	}

	function disconnect_vivus(): void {
		svg_observers.forEach((observer) => {
			observer.disconnect()
		})

		svg_observers = []

		vivus_instances.forEach((vivus) => {
			vivus.destroy()
		})

		vivus_instances = []
	}

	let fading_observers: IntersectionObserver[] = []

	function invisible_slide_fade_in(): void {
		const elements = document.querySelectorAll('.slide-fade-in-visible')

		elements.forEach((element) => {
			element.classList.remove('slide-fade-in-visible')
		})
	}

	function add_slide_in_animation(): void {
		const elements = document.querySelectorAll('.slide-fade-in')

		elements.forEach((element) => {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (!animations_enabled) return

						if (entry.isIntersecting) {
							element.classList.add('slide-fade-in-visible')
						} else {
							element.classList.remove('slide-fade-in-visible')
						}
					})
				},
				{ rootMargin: '-0px', threshold: 0 }
			)

			observer.observe(element)
			fading_observers.push(observer)
		})
	}

	function disable_slide_in_animation(): void {
		const elements = document.querySelectorAll('.slide-fade-in')

		elements.forEach((element) => {
			element.classList.add('visible')
		})

		fading_observers.forEach((observer) => {
			observer.disconnect()
		})

		fading_observers = []
	}

	function enable_animations(): void {
		if (!browser) return

		connect_vivus()
		add_slide_in_animation()
	}

	function disable_animations(): void {
		if (!browser) return

		disconnect_vivus()
		disable_slide_in_animation()
	}

	function switch_animations(animations_enabled: boolean): void {
		if (animations_enabled) {
			enable_animations()
		} else {
			disable_animations()
		}
	}

	beforeNavigate(() => {
		invisible_slide_fade_in()
		disable_animations()
	})

	afterNavigate(() => {
		close_mobile_docs_side_bar()
		add_copy_code_event()
		switch_animations($animations_enabled && $is_min_width_768)
	})

	$: {
		switch_animations($animations_enabled && $is_min_width_768)
	}

	onMount(() => {
		create_search_shortcut()

		const media_query = window.matchMedia('(min-width: 768px)')
		const handle_media_change = (e: MediaQueryListEvent): boolean => ($is_min_width_768 = e.matches)
		media_query.addEventListener('change', handle_media_change)

		$is_min_width_768 = media_query.matches

		return (): void => {
			media_query.removeEventListener('change', handle_media_change)
		}
	})
</script>

<svelte:head>
	<style>
		@keyframes slide-fade-in {
			0% {
				transform: translateX(50px);
				opacity: 0;
			}
			100% {
				transform: translateX(0);
				opacity: 1;
			}
		}

		.slide-fade-in {
			visibility: hidden;
		}

		.visible {
			visibility: visible !important;
		}

		.slide-fade-in-visible {
			animation: slide-fade-in 1s ease-out;
			visibility: visible;
		}
	</style>
</svelte:head>

<Audio />

<div class="doc-base">
	<Navbar is_on_docs on:show_search_modale={open_search_modale} />
	<NavbarSecondRow on:open_mobile_docs_side_bar={open_mobile_docs_side_bar} />

	{#if mobile_docs_side_bar_open}
		<div
			class="fixed left-0 top-0 z-20 h-full w-full backdrop-blur-sm"
			transition:fly={{ duration: 250 }}
		/>

		<div class="fixed left-0 top-0 z-50 w-full" transition:fly={{ x: -100, duration: 250 }}>
			<MobileDocsSideBar {sections} on:close={close_mobile_docs_side_bar} />
		</div>
	{/if}

	{#if search_modale_open}
		<SearchModale on:close={close_search_modale} bind:search_query bind:this={search_modale} />
	{/if}

	<div class="max-w-8xl mx-auto min-h-screen">
		<div
			class="fixed mt-8 hidden h-[calc(100vh-2rem-var(--header-height))] overflow-y-auto pe-4 ps-8 md:block md:w-72"
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
		@apply bg-base dark:bg-base-dark;
	}
</style>
