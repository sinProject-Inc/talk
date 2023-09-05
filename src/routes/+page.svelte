<script>
	import { App } from '$lib/app/app'
	import Navbar from '$lib/components/navbar.svelte'
	import SocialMetaTags from '$lib/components/social_meta_tags.svelte'
	import VersionFooter from '$lib/components/version_footer.svelte'
</script>

<SocialMetaTags title={App.app_name} description={App.description} />

<Navbar />

<div class="doc-base">
	<div class="flex h-[calc(100vh-var(--header-height))] flex-col items-center justify-center p-8">
		<div class="font-title flex max-w-xl flex-col items-center gap-12">
			<div class="text-3xl">Talk</div>
			<div class="text-sm">PUSH MENU BUTTON...</div>
			<div class="text-sm">
				Talk is an app for conversing in real time with people who speak different languages.
			</div>
			<div><VersionFooter /></div>
		</div>
	</div>
</div>

<style type="postcss">
	@font-face {
		font-family: 'title';
		src: url('/fonts/press-start-2p.woff2');
		font-display: swap;
	}

	.font-title {
		font-family: 'title';
	}
</style>
