<script lang="ts">
	import '$lib/app.css'
	import background from '$lib/assets/gradient_geometric_shapes.png'
	import ProgressBar from '$lib/components/progress_bar.svelte'
	import { Direction } from '$lib/view/direction'
	import { onMount } from 'svelte'
	import { locale } from 'svelte-i18n'

	function get_direction(locale_code: string): string {
		return new Direction(locale_code).value
	}

	let progress_bar: ProgressBar

	onMount(() => {
		progress_bar.add_event_listener()
	})
</script>

<ProgressBar bind:this={progress_bar} />

<div
	class="bg-fixed min-h-screen bg-no-repeat bg-cover"
	style="background-image: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('{background}')"
	dir={get_direction($locale ?? '')}
>
	<!-- <div class="shadow-in flex fixed min-h-screen w-full flex-col backdrop-blur-md backdrop-filter">
	</div> -->
	<slot />
</div>
