<script lang="ts">
	import Header from '$lib/components/header.svelte'
	import TextBox from '$lib/components/translate/text_box.svelte'
</script>

<Header />
<div class="center-container">
	<div class="px-4">
		<div class="flex justify-evenly py-4 mb-2 items-center gap-4">
			<select class="grow" name="language_1" id="language_1">
				<option value="english">English</option>
			</select>
			<div>⇆</div>
			<select class="grow" name="language_2" id="language_2">
				<option value="japanese">Japanese</option>
			</select>
		</div>
		<div class="flex flex-col gap-6">
			<TextBox />
			<TextBox />
		</div>
	</div>
</div>
