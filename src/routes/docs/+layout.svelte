<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation'
	import Navbar from '$lib/components/navbar.svelte'
	import Snackbar from '$lib/components/snackbar.svelte'
	import { KeyboardShortcutHandler } from '$lib/view/keyboard_shortcut_handler'
	import { WebLogger } from '$lib/view/log/web_logger'
	import { onMount } from 'svelte'
	import { _ } from 'svelte-i18n'
	import { fly } from 'svelte/transition'
	import Vivus from 'vivus'
	import Audio from './audio.svelte'
	import MobileSideBar from './mobile-side-bar.svelte'
	import NavbarSecondRow from './navbar-second-row.svelte'
	import SearchModale from './search-modale.svelte'
	import SideBar from './side-bar.svelte'

	let search_modale_open = false
	let mobile_side_bar_open = false

	let sidebar_element: HTMLElement

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

	let svg_elements: SVGSVGElement[] = []
	let observers: IntersectionObserver[] = []
	let vivus_instances: Vivus[] = []

	function disconnect_vivus(): void {
		svg_elements.forEach((svg_element, index) => {
			observers[index].disconnect()
			vivus_instances[index].stop()
		})

		svg_elements = []
		observers = []
		vivus_instances = []
	}

	function connect_vivus(): void {
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
			observers.push(observer)
		})
	}

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
		})
	}

	function handle_scroll_on_sidebar(): void {
		let list_parent = document.getElementById('sidebar-parent')

		if (!list_parent) return

		const children: NodeListOf<HTMLElement> = list_parent.querySelectorAll('.sidebar-content')

		if (!children) return

		for (var i = 0; i < children.length; i++) {
			const transparency_threshold = 110

			if (!children[i]) return

			children[i].getBoundingClientRect().top <= transparency_threshold
				? toggle_transparency(children[i], true)
				: toggle_transparency(children[i], false)
		}
	}

	function toggle_transparency(target: HTMLElement, flag: boolean): void {
		let style_active_flag = ''

		style_active_flag = get_style_active_flag(target)

		if (flag) {
			set_transparent(target, style_active_flag)
		} else {
			remove_transparent(target, style_active_flag)
		}
	}

	function get_style_active_flag(target: HTMLElement): string {
		if (!target) return ''

		if (target.classList.contains('titles')) return ''

		const current_url = window.location.href
		const current_page = get_page_name_from_url(current_url)

		const target_text = target.textContent
		const target_text_to_lower = target_text?.toLowerCase()

		if (current_page == target_text_to_lower) {
			return 'active'
		} else {
			return 'inactive'
		}
	}

	function get_page_name_from_url(url: string): string {
		let page_name = url.split('/').pop()

		if (!page_name) return ''

		page_name = page_name.replace('-', ' ')

		return page_name
	}

	function set_transparent(target: HTMLElement, style_active_flag: string): void {
		target.classList.add('text-transparent')
		target.classList.add('border-transparent')

		if (style_active_flag == 'active') {
			target.classList.remove('active')
		}
		if (style_active_flag == 'inactive') {
			target.classList.remove('inactive')
		}
	}

	function remove_transparent(target: HTMLElement, style_active_flag: string): void {
		target.classList.remove('text-transparent')
		target.classList.remove('border-transparent')

		if (style_active_flag == 'active') {
			target.classList.add('active')
		}
		if (style_active_flag == 'inactive') {
			target.classList.add('inactive')
		}
	}

	beforeNavigate(() => {
		disconnect_vivus()
		invisible_slide_fade_in()
	})

	afterNavigate(() => {
		close_mobile_side_bar()
		add_copy_code_event()
		connect_vivus()
		add_slide_in_animation()
	})

	onMount(() => {
		create_search_shortcut()
		sidebar_element.addEventListener('scroll', handle_scroll_on_sidebar)
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

		.slide-fade-in-visible {
			animation: slide-fade-in 1s ease-out;
			visibility: visible;
		}
	</style>
</svelte:head>

<Audio />

<div class="doc-base">
	<Navbar search_bar_enabled on:show_search_modale={open_search_modale} />
	<NavbarSecondRow on:open_mobile_side_bar={open_mobile_side_bar} />

	{#if mobile_side_bar_open}
		<div
			class="fixed left-0 top-0 z-20 h-full w-full backdrop-blur-sm"
			transition:fly={{ duration: 250 }}
		/>

		<div class="fixed left-0 top-0 z-50 w-full" transition:fly={{ x: -100, duration: 250 }}>
			<MobileSideBar {sections} on:close={close_mobile_side_bar} />
		</div>
	{/if}

	{#if search_modale_open}
		<SearchModale on:close={close_search_modale} bind:search_query />
	{/if}

	<div class="max-w-8xl mx-auto min-h-screen">
		<div
			class="fixed hidden h-[calc(100vh-var(--header-height))] overflow-y-auto pe-4 ps-8 md:block md:w-72"
			bind:this={sidebar_element}
		>
			<SideBar {sections} scroll_transparent={true} on:show_search_modale={open_search_modale} />
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
