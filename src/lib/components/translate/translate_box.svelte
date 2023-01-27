<script>
	import IconButton from '$lib/components/icon_button.svelte'
	import CloseIcon from '../icons/close_icon.svelte'
	import SpeakerIcon from '../icons/speaker_icon.svelte'
	import CopyIcon from '../icons/copy_icon.svelte'
	import VoiceIcon from '$lib/components/icons/voice_icon.svelte'
</script>

<div class="glass rounded-md shadow-lg">
	<div class="grid">
		<div class="z-10 flex justify-end h-10 pr-2 pt-2" style="grid-area: 1/8/1/9">
			<div class="w-5 fill-black/50">
				<CloseIcon />
			</div>
		</div>
		<textarea class=" pt-8 resize-none bg-white/50 glass rounded-t-md border-0 outline-none outline-0 focus:outline-none" style="grid-area: 1/1/2/9" rows="8" />
	</div>
	<div class="flex fill-white bg-white/20 rounded-b-md p-1">
		<div class="mr-auto flex gap-1">
			<IconButton><VoiceIcon /></IconButton>
			<IconButton><SpeakerIcon /></IconButton>
		</div>
		<div>
			<IconButton><CopyIcon /></IconButton>
		</div>
	</div>
</div>
