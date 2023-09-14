<script lang="ts">
	import { page } from '$app/stores'
	import { App } from '$lib/app/app'
	import { MetaTags } from 'svelte-meta-tags'

	export let title: string
	export let description: string

	const site_name = App.company_and_app_name
	const url_origin = $page.url.origin
	const url = $page.url.href
	const type = $page.url.pathname === '/' ? 'website' : 'article'

	const image_url = `${url_origin}/icon-512.png`
	const image_alt = `${site_name} logo`

	const site = '@iam_o_sin'
</script>

<MetaTags
	{title}
	{description}
	openGraph={{
		url,
		type,
		title,
		description,
		images: [{ url: image_url, alt: image_alt }],
		siteName: site_name,
	}}
	twitter={{
		site,
		handle: site,
		cardType: 'summary_large_image',
		title,
		description,
		image: image_url,
		imageAlt: image_alt,
	}}
/>
