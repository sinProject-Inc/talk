import { Background } from './background'
import { BackgroundIndex } from './background_index'
import { expect, test } from 'vitest'

test('constructor sets _background_url correctly when _background_index.index exists in _background_urls', () => {
	const background_index = new BackgroundIndex(0)
	const background = new Background(background_index)

	expect(background.background_url).toEqual('/src/lib/assets/beach-30.avif')
})

test('constructor throws error when _background_index.index does not exist in _background_urls', () => {
	const background_index = new BackgroundIndex(100)

	expect(() => new Background(background_index)).toThrow('Invalid Background index')
})
