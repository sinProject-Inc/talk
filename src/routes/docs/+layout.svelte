<script lang="ts">
	import Sidebar from './sidebar.svelte'

	export let data
</script>

<div class="p-8 glass h-screen flex flex-row">
	<div class="w-80 overflow-x-scroll">
		<Sidebar sections={data?.sections ?? []} />
	</div>
	<div class="w-full overflow-x-scroll">
		<slot />
	</div>
</div>
