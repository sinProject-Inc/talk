<script lang="ts">
	import { onMount } from 'svelte'
	import type { LayoutServerParentData } from '../$types'
	import Navbar from '$lib/components/navbar.svelte'
	import empty_profile_picture from '$lib/assets/profile_picture.png'

	export let data: LayoutServerParentData

	let email: string

	let file_input: HTMLInputElement
	let form: HTMLFormElement

	function init(): void {
		email = data.user.email
	}

	function submit_form(): void {
		form.submit()
	}

	function open_file_input(): void {
		file_input.click()
	}

	onMount(() => {
		init()
	})
</script>

<svelte:head>
	<title>Talk - Profile</title>
</svelte:head>

<div>
	<Navbar />
	<div class="px-4">
		<div class="glass-panel max-w-xl w-full flex flex-col px-10 py-4 min-w-fit mx-auto mb-36 mt-28">
			<div class="title flex flex-row items-center">Profile</div>
			<div class="flex flex-col items-center justify-center h-full pt-20 pb-24">
				<button
					class="w-28 h-28 mb-6 rounded-full overflow-hidden flex items-center justify-center group cursor-pointer"
					on:click={open_file_input}
				>
					<img
						src={empty_profile_picture}
						alt="Profile"
						class="w-28 h-28 absolute object-cover bg-white/50 rounded-full"
					/>
					<div
						class="w-28 h-28 absolute rounded-full group-hover:bg-black/60 transition-all duration-150 flex items-center justify-center"
					>
						<div
							class="font-bold text-center text-white/0 group-hover:text-white transition-all duration-150 select-none"
						>
							CHANGE ICON
						</div>
					</div>
				</button>
				<div>{email}</div>
			</div>
		</div>
	</div>
	<form method="POST" class="hidden" bind:this={form} enctype="multipart/form-data">
		<input
			name="image"
			type="file"
			accept=".jpg, .jpeg"
			on:change={submit_form}
			bind:this={file_input}
		/>
	</form>
</div>
