<script lang="ts">
	import { App } from '$lib/app/app'
	import { AvatarUrl } from '$lib/avatar/avatar_url'
	import Navbar from '$lib/components/navbar.svelte'
	import { UserId } from '$lib/user/user_id'
	import { _ } from 'svelte-i18n'
	import { MetaTags } from 'svelte-meta-tags'
	import type { PageServerData } from './$types'

	export let data: PageServerData

	const email = data.email
	const user_id = new UserId(data.user_id)
	let avatar_url = new AvatarUrl(user_id).url

	let file_input: HTMLInputElement
	let form: HTMLFormElement

	function submit_form(): void {
		form.submit()
	}

	function open_file_input(): void {
		file_input.click()
	}
</script>

<MetaTags title={App.get_page_title('Profile')} description={App.description} />

<div>
	<Navbar />
	<div class="px-4">
		<div class="glass-panel mx-auto mb-36 mt-28 flex w-full min-w-fit max-w-xl flex-col px-10 py-4">
			<div class="title flex flex-row items-center">{$_('profile')}</div>
			<div class="flex h-full flex-col items-center justify-center pb-24 pt-20">
				<button
					class="group mb-6 flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full"
					on:click={open_file_input}
				>
					<img
						src={avatar_url}
						alt="Profile"
						class="absolute h-28 w-28 rounded-full bg-white/50 object-cover"
					/>
					<div
						class="absolute flex h-28 w-28 items-center justify-center rounded-full transition-all duration-150 group-hover:bg-black/60"
					>
						<div
							class="select-none text-center font-bold text-white/0 transition-all duration-150 group-hover:text-white"
						>
							{$_('change_icon')}
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
			accept=".jpg, .jpeg, .png"
			size="5000000"
			on:change={submit_form}
			bind:this={file_input}
		/>
	</form>
</div>
