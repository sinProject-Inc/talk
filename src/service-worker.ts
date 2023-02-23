/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const worker = self as unknown as ServiceWorkerGlobalScope

/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker'

const FILES = `cache${version}`

// `build` is an array of all the files generated by the bundler,
// `files` is an array of everything in the `static` directory
const to_cache = build.concat(files)
const static_assets = new Set(to_cache)

worker.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(FILES)
			.then((cache) => cache.addAll(to_cache))
			.then(() => {
				worker.skipWaiting()
			})
	)
})

worker.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			// delete old caches
			for (const key of keys) {
				if (key !== FILES) await caches.delete(key)
			}

			worker.clients.claim()
		})
	)
})

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 */
async function fetch_and_cache(request: Request): Promise<Response> {
	const cache = await caches.open(`offline${version}`)

	try {
		const response = await fetch(request)
		cache.put(request, response.clone())
		return response
	} catch (err) {
		const response = await cache.match(request)
		if (response) return response

		throw err
	}
}

worker.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || event.request.headers.has('range')) return

	const url = new URL(event.request.url)

	// don't try to handle e.g. data: URIs
	const is_http = url.protocol.startsWith('http')
	const is_dev_server_request =
		url.hostname === self.location.hostname && url.port !== self.location.port
	const is_static_asset = url.host === self.location.host && static_assets.has(url.pathname)
	const skip_because_uncached = event.request.cache === 'only-if-cached' && !is_static_asset

	if (is_http && !is_dev_server_request && !skip_because_uncached) {
		event.respondWith(
			// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
			(async () => {
				// always serve static files and bundler-generated assets from cache.
				// if your application has other URLs with data that will never change,
				// set this variable to true for them and they will only be fetched once.
				const cached_asset = is_static_asset && (await caches.match(event.request))

				return cached_asset || fetch_and_cache(event.request)
			})()
		)
	}
})