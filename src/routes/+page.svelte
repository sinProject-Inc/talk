<script>
	import Navbar from '$lib/components/navbar.svelte'
	import { MetaTags } from 'svelte-meta-tags'
	import { App } from '$lib/app/app'
	import VersionFooter from '$lib/components/version_footer.svelte'
</script>

<MetaTags title={App.app_name} description={App.description} />

<Navbar />

<div class="doc-base">
	<div class="flex h-[calc(100vh-var(--header-height))] flex-col items-center justify-center p-8">
		<div class="font-title flex max-w-xl flex-col items-center gap-12">
			<div class="text-7xl">Talk</div>
			<div class="text-lg">PUSH MENU BUTTON</div>
			<div class="text-lg">
				Talk is an app for conversing in real time with people who speak different languages.
			</div>
			<div><VersionFooter /></div>
		</div>
	</div>
</div>

<style type="postcss">
	@font-face {
		font-family: 'title';
		src: url('/fonts/press-start-2p.ttf') format('truetype');
		font-display: swap;
	}

	.font-title {
		font-family: 'title';
	}
</style>
