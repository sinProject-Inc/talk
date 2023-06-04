<script lang="ts">
	import { base } from '$app/paths'
	import { page } from '$app/stores'
	import NavItem from './nav_item.svelte'
	import Tab from './tab.svelte'

	export let name: string

	const active = $page.url.href.includes(`${base}/${name}`)
</script>

<Tab {active}>
	<NavItem {name} />
</Tab>
