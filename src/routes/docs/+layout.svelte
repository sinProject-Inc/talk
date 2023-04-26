<script lang="ts">
	import SideBar from './side-bar.svelte'

	export let data

	$: sections = data?.sections ?? []
</script>

<div class="doc-base min-h-screen">
	<div class="w-72 ps-8 pe-4 pb-8 fixed overflow-y-auto">
		<SideBar {sections} />
	</div>
	<div class="ps-80 py-8">
		<slot />
	</div>
</div>

<!-- <style>
	.doc-base {
		background: rgba(0, 0, 0, 0.25);
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		/* backdrop-filter: blur(4px); */
		-webkit-backdrop-filter: blur(4px);
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.18);
	}
</style> -->
