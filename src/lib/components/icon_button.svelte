<script lang="ts">
	export let onClickHandler: () => void = () => { return } 
</script>

<button on:click={onClickHandler}>
	<div class="flex flex-row justify-center h-6 w-6">
		<slot />
	</div>
</button>
