import { Background } from './background'
import { expect, it } from 'vitest'
import { BackgroundIndex } from './background_index'

type Spec = {
	name: string
	index: number
	expected?: string
	error_message?: string
}

const specs: Spec[] = [
	{ name: 'zero', index: 0, expected: '/src/lib/assets/beach-30.avif' },
	{ name: 'eleven', index: 11, expected: '/src/lib/assets/purple2-30.avif' },
	{ name: 'negative', index: 12, error_message: 'Invalid Background index' },
]

it.each(specs)(
	'new Background($index).index ($name} -> ($expected) : ($error_message)',
	(spec: Spec) => {
		const { index, expected, error_message } = spec

		const background_index = new BackgroundIndex(index)

		if (error_message) {
			expect(() => new Background(background_index)).toThrow(error_message)

			return
		}

		const background = new Background(background_index)
		expect(background.background_url).toBe(expected)
	}
)
