<script lang="ts">
	import SideBar from './side-bar.svelte'

	export let data

	$: sections = data?.sections ?? []
</script>

<div class="doc-base">
	<div class="max-w-7xl min-h-screen mx-auto">
		<div class="w-72 ps-8 pe-4 pb-8 h-screen fixed overflow-y-auto">
			<SideBar {sections} />
		</div>
		<div class="ps-80 py-8">
			<slot />
		</div>
	</div>
</div>
