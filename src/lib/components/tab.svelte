<script lang="ts">
	export let active = false
</script>

<div class:active class="flex h-full items-center">
	<slot />
</div>

<style lang="postcss">
	.active {
		@apply border-b-2 border-secondary pt-[2px] dark:border-secondary-dark;
	}
</style>
