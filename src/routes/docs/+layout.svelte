<script lang="ts">
	import SideBar from './side-bar.svelte'

	export let data
</script>

<div class="glass h-screen flex flex-row">
	<div class="w-80 overflow-x-scroll ps-8 pe-4 pb-8">
		<SideBar sections={data?.sections ?? []} />
	</div>
	<div class="w-full overflow-x-scroll ps-4 pe-8 py-8">
		<slot />
	</div>
</div>
