<script lang="ts">
	import { _ } from 'svelte-i18n'
	import '../../app.css'
</script>

<div class="root_container flex items-center justify-center h-screen">
	<div class="center_container width_limit">
		<div class="md:mb-40 mb-0 pb-4 py-2 card p-4 mx-3">
			<h1 class="title w-full">{$_('sign_up')}</h1>
			<p class="h-8 mt-4">{$_('please_sign_in')}</p>
			<div class="flex-col flex gap-2 mt-4">
				<a href="/sign-in"><button class="submit_button">{$_('sign_in')}</button></a>
			</div>
		</div>
	</div>
</div>

<style>
	.width_limit {
		margin-left: auto;
		margin-right: auto;
		width: 100%;
		max-width: calc(500px + 2rem);
	}

	form > input,
	form > button {
		width: 100%;
		box-sizing: border-box;
		height: 32px;
	}

	.submit_button {
		background-color: var(--blue-color);
		color: white;
		font-weight: 600;
		border-color: var(--blue-color);
	}
</style>
