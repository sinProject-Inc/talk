<script lang="ts">
	import { navigating } from '$app/stores'
	import '$lib/app.css'
	import background from '$lib/assets/gradient_geometric_shapes.png'
	import { Direction } from '$lib/view/direction'
	import NProgress from 'nprogress'
	import 'nprogress/nprogress.css'
	import { locale } from 'svelte-i18n'

	function get_direction(locale_code: string): string {
		return new Direction(locale_code).value
	}

	NProgress.configure({ showSpinner: false })

	$: {
		if ($navigating) {
			NProgress.start()
		} else {
			NProgress.done()
		}
	}
</script>

<div
	class="bg-fixed min-h-screen bg-no-repeat bg-cover"
	style="background-image: linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('{background}')"
	dir={get_direction($locale ?? '')}
>
	<!-- <div class="shadow-in flex fixed min-h-screen w-full flex-col backdrop-blur-md backdrop-filter">
	</div> -->
	<slot />
</div>
