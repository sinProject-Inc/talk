import { ApiPath } from '$lib/api/api_path'
import { expect, it } from 'vitest'

const base = ''
// const base = '/talk'

it('/api', () => {
	const api_path = ApiPath.api_directory

	expect(api_path.path()).toEqual(`${base}/api`)
})

it('/api/text', () => {
	const api_path = ApiPath.api_directory.connect('text')

	expect(api_path.path()).toEqual(`${base}/api/text`)
})

it('/api/text/おはよう', () => {
	const api_path = ApiPath.api_directory.connect('test').connect_with_encoding('おはよう')

	expect(api_path.path()).toEqual(`${base}/api/test/%E3%81%8A%E3%81%AF%E3%82%88%E3%81%86`)
})

it('/api/text?param=test', () => {
	const api_path = ApiPath.api_directory.connect('text').connect_with_params({ param: 'test' })

	expect(api_path.path()).toEqual(`${base}/api/text?param=test`)
})

it('/api/text?param=test&param2=test2', () => {
	const api_path = ApiPath.api_directory
		.connect('text')
		.connect_with_params({ param: 'test', param2: 'test2' })

	expect(api_path.path()).toEqual(`${base}/api/text?param=test&param2=test2`)
})

it('/api/text', () => {
	const api_path = ApiPath.api_directory.connect('text').connect_with_params({ param: '' })

	expect(api_path.path()).toEqual(`${base}/api/text`)
})

it('add_base_path', () => {
	const api_path = ApiPath.api_directory.add_base_path('/base')

	expect(api_path.path()).toEqual(`${base}/base/api`)
})

it('add_base_path: empty', () => {
	const api_path = ApiPath.api_directory.add_base_path('')

	expect(api_path.path()).toEqual(`${base}/api`)
})
