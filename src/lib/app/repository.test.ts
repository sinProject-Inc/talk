import { expect, test } from 'vitest'
import { Repository } from './repository'

test('context', async () => {
	expect(Repository.context).toBeTruthy()
})
