<script lang="ts">
	function start_progress_bar(): void {
		const progress_bar = document.getElementById('progress-bar') as HTMLElement
		let width = 0

		const interval = setInterval(() => {
			if (width >= 100) {
				clearInterval(interval)
			} else {
				width++
				progress_bar.style.width = `${width}%`
			}
		}, 10)
	}

	async function load_page(url: string): Promise<void> {
		start_progress_bar()

		try {
			const response = await fetch(url)
			const html = await response.text()

			document.body.innerHTML = html

			window.history.pushState(null, '', url)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error fetching the new page:', error)
		}
	}

	export function add_event_listener(): void {
		const links = document.querySelectorAll('a')

		links.forEach((link) => {
			link.addEventListener('click', (event) => {
				event.preventDefault()
				const url = link.getAttribute('href') as string
				load_page(url)
			})
		})
	}
	// Replace this with the actual links that trigger page transitions
</script>

<div id="progress-container">
	<div id="progress-bar" />
</div>

<style>
	#progress-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		/* background-color: #eee; */
		z-index: 1000;
	}

	#progress-bar {
		height: 100%;
		width: 0;
		background-color: var(--link-color);
		transition: width 0.2s ease-in-out;
	}
</style>
