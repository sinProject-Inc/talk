import { expect, test } from 'vitest'
import { logger } from './logger'

test('logger', async () => {
	expect(logger).toBeTruthy()
})
