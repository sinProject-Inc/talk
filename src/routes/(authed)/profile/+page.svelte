<script lang="ts">
	import { onMount } from 'svelte'
	import type { LayoutServerParentData } from '../$types'
	import Navbar from '$lib/components/navbar.svelte'

	export let data: LayoutServerParentData

	let email: string
	onMount(() => {
		email = data.user.email
	})

	// const email = data.user.email
</script>

<div>
	<Navbar />
	<div class="px-4">
		<div class="glass-panel max-w-xl w-full flex flex-col px-10 py-4 min-w-fit mx-auto mb-36 mt-28">
			<div class="title flex flex-row items-center">Profile</div>
			<div class="flex flex-col items-center justify-center h-full pt-20 pb-[6.5rem]">
				<div class="rounded-full bg-green-400 w-28 h-28 mb-6" />
				<div>{email}</div>
			</div>
		</div>
	</div>
</div>
