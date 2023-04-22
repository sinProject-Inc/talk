<script lang="ts">
	import Sidebar from './sidebar.svelte'

	export let data
</script>

<div class="p-8 glass h-screen flex flex-row">
	<div class="w-80">
		<Sidebar sections={data?.sections ?? []} />
	</div>
	<div class="overflow-x-scroll">
		<slot />
	</div>
</div>
