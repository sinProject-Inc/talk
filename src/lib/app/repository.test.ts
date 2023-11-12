import { expect, it } from 'vitest'
import { Repository } from './repository'

it('context', async () => {
	expect(Repository.context).toBeTruthy()
})
