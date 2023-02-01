<script lang="ts">
	export let on_click_handler: () => void = () => { return } 
</script>

<button on:click={on_click_handler} class="">
	<div class="flex flex-row justify-center h-6 w-6">
		<slot />
	</div>
</button>
