import { ApiPath } from '$lib/api/api_path'
import { expect, test } from 'vitest'

test('/api', () => {
	const api_path = ApiPath.api_directory
	expect(api_path.path()).toEqual('/api')
})

test('/api/text', () => {
	const api_path = ApiPath.api_directory.connect('text')
	expect(api_path.path()).toEqual('/api/text')
})

test('/api/text/おはよう', () => {
	const api_path = ApiPath.api_directory.connect('test').connect_with_encoding('おはよう')
	expect(api_path.path()).toEqual('/api/test/%E3%81%8A%E3%81%AF%E3%82%88%E3%81%86')
})

test('/api/text?param=test', () => {
	const api_path = ApiPath.api_directory.connect('text').connect_with_params({ param: 'test' })
	expect(api_path.path()).toEqual('/api/text?param=test')
})

test('/api/text?param=test&param2=test2', () => {
	const api_path = ApiPath.api_directory
		.connect('text')
		.connect_with_params({ param: 'test', param2: 'test2' })
	expect(api_path.path()).toEqual('/api/text?param=test&param2=test2')
})

test('/api/text', () => {
	const api_path = ApiPath.api_directory.connect('text').connect_with_params({ param: '' })
	expect(api_path.path()).toEqual('/api/text')
})

test('add_base_path', () => {
	const api_path = ApiPath.api_directory.add_base_path('/base')
	expect(api_path.path()).toEqual('/base/api')
})

test('add_base_path: empty', () => {
	const api_path = ApiPath.api_directory.add_base_path('')
	expect(api_path.path()).toEqual('/api')
})
