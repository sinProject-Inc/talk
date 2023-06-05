<script>
	import VolumeOffIcon from './icons/volume_off_icon.svelte'
	import VolumeOnIcon from './icons/volume_on_icon.svelte'

	let volume_on = true
</script>

<!-- ボタンのクラス定義を共通化する -->
<button class="glowing-icon px-0">
	<div class="h-5">
		{#if volume_on}
			<VolumeOnIcon />
		{:else}
			<VolumeOffIcon />
		{/if}
	</div>
</button>
