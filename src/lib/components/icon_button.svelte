<script lang="ts">
	export let on_click_handler: () => void = () => {
		return
	}
	export let enabled = true

	let grow = false

	function animate(): void {
		if (!enabled) return

		grow = true

		setTimeout(() => {
			grow = false
		}, 100)
	}
</script>

<button
	on:click={on_click_handler}
	on:click={animate}
	disabled={!enabled}
>
	<div
		class="flex flex-row justify-center h-9 w-9 -m-[6.5px] transition-colors p-[6.5px] rounded-full {enabled
			? 'hover:bg-white/5'
			: 'fill-white/50'} {grow ? 'scale-110 hover:bg-white/30 duration-75' : 'duration-300'}"
	>
		<slot />
	</div>
</button>
