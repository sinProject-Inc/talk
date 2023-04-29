<script lang="ts">
	import SideBar from './side-bar.svelte'

	export let data

	$: sections = data?.sections ?? []
</script>

<div class="doc-base">
	<div class="max-w-7xl min-h-screen mx-auto">
		<div class="md:w-72 ps-8 pe-4 pb-8 h-screen fixed overflow-y-auto hidden md:block">
			<SideBar {sections} />
		</div>
		<div class="ps-12 pe-8 md:ps-80 py-8 lg:pe-80">
			<slot />
		</div>
	</div>
</div>

<style lang="postcss">
	:root {
		background: black;
	}
</style>
