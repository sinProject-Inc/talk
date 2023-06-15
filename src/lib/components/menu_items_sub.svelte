<script>
	import { base } from '$app/paths'
	import { page } from '$app/stores'

	import GithubIcon from './icons/github_icon.svelte'
	import ProfileIcon from './icons/profile_icon.svelte'
	import SignInIcon from './icons/sign_in_icon.svelte'
	import SignOutIcon from './icons/sign_out_icon.svelte'

	const encoded_redirect_url = encodeURIComponent($page.url.pathname)
</script>

<a
	href="https://github.com/sinProject-Inc/talk"
	target="_blank"
	class="flex items-center gap-1"
	title="GitHub"
>
	<div class="h-nav-icon"><GithubIcon /></div>
</a>
{#if $page.data.user}
	<a href="{base}/profile" class="flex items-center gap-1" title="Profile">
		<div class="h-nav-icon"><ProfileIcon /></div>
	</a>
	<form action="{base}/sign-out" method="POST">
		<button class="glowing-icon flex" type="submit" title="Sign out">
			<SignOutIcon />
		</button>
	</form>
{:else}
	<a
		title="Sign in"
		class="flex flex-row items-center no-underline"
		href="{base}/sign-in?redirect_url={encoded_redirect_url}"
		><div class="h-nav-icon">
			<SignInIcon />
		</div>
	</a>
{/if}
