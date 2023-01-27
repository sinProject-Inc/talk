<script lang="ts">
	import Header from '$lib/components/header.svelte'
	import IconButton from '$lib/components/icon_button.svelte'
	import TranslateBox from '$lib/components/translate/translate_box.svelte'
</script>

<Header />
<div class="center-container">
	<div class="px-4">
		<div
			class="flex justify-evenly my-4 mb-2 items-center glass rounded-md bg-white gap-4 shadow-lg"
		>
			<select
				class="rounded-r-none outline-0 bg-transparent rounded-l-md p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
				name="language_1"
				id="language_1"
			>
				<option value="english">English</option>
			</select>
			<IconButton>⇆</IconButton>
			<select
				class="rounded-l-none outline-0 bg-transparent rounded-r-md p-2 h-full text-center hover:scale-110 transition-all duration-300 grow appearance-none"
				name="language_2"
				id="language_2"
			>
				<option value="japanese">Japanese</option>
			</select>
		</div>
		<div class="flex flex-col gap-10">
			<TranslateBox />
			<TranslateBox />
		</div>
	</div>
</div>
