<script lang="ts">
	export let enabled = true
	export let title = ''

	let class_name = ''

	export { class_name as class }

	let grow = false

	function animate(): void {
		if (!enabled) return

		grow = true

		setTimeout(() => {
			grow = false
		}, 100)
	}
</script>

<button on:click on:click={animate} disabled={!enabled} {title}>
	<div
		class="{class_name} -m-[6.5px] flex h-9 w-9 flex-row justify-center rounded-full p-[6.5px] transition-colors {enabled
			? 'glass-text-4 glass-bump-bg-shine'
			: 'glass-text-faint-md'} {grow
			? 'scale-110 duration-75 hover:bg-primary-5/5 dark:hover:bg-primary-dark-5/5'
			: 'duration-[350ms]'}"
	>
		<slot />
	</div>
</button>
