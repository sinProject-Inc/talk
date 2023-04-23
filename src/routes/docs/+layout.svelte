<script lang="ts">
	import SideBar from './side-bar.svelte'

	export let data
</script>

<div class="p-8 glass h-screen flex flex-row">
	<div class="w-80 overflow-x-scroll">
		<SideBar sections={data?.sections ?? []} />
	</div>
	<div class="w-full overflow-x-scroll">
		<slot />
	</div>
</div>
