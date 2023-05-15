<script lang="ts">
	export let enabled = true

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

<button on:click on:click={animate} disabled={!enabled}>
	<div
		class="{class_name} -m-[6.5px] flex h-9 w-9 flex-row justify-center rounded-full p-[6.5px] transition-colors {enabled
			? 'text-white/75 hover:bg-white/5'
			: 'text-white/50'} {grow ? 'scale-110 duration-75 hover:bg-white/30' : 'duration-300'}"
	>
		<slot />
	</div>
</button>
