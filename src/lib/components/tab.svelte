<script lang="ts">
	export let active = false
</script>

<div class:active class="flex h-full items-center">
	<slot />
</div>

<style lang="postcss">
	.active {
		@apply border-b-2 border-sky-500 pt-[2px];
	}
</style>
