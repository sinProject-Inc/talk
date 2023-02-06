<script lang="ts">
	export let on_click_handler: () => void = () => {
		return
	}
	export let disabled = false

	let grow = false

	function animate(): void {
		if (disabled) return

		grow = true

		setTimeout(() => {
			grow = false
		}, 100)
	}
</script>

<button
	class={disabled ? 'cursor-default' : ''}
	on:click={on_click_handler}
	on:click={animate}
	{disabled}
>
	<div
		class="flex flex-row justify-center h-9 w-9 -m-[6.5px] transition-colors p-[6.5px] rounded-full {disabled
			? 'fill-white/50'
			: 'hover:bg-white/5'} {grow ? 'scale-110 hover:bg-white/30 duration-75' : 'duration-300'}"
	>
		<slot />
	</div>
</button>
