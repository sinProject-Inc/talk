import { ApiPath } from '$lib/api/api_path'
import { expect, test } from 'vitest'
import { Api } from './api'

test('/api', () => {
	const api_path = ApiPath.api_directory
	expect(api_path.get_url()).toBe('/api')
})

test('/api/text', () => {
	const api_path = ApiPath.api_directory.connect('text')
	expect(api_path.get_url()).toBe('/api/text')	
})

test('/api/text/おはよう', () => {
	const api_path = ApiPath.api_directory.connect('test').connect_with_encoding('おはよう')
	expect(api_path.get_url()).toBe('/api/test/%E3%81%8A%E3%81%AF%E3%82%88%E3%81%86')
})

test('http://localhost:5173/api/text/おはよう', () => {
	const api_path = ApiPath.api_directory.connect('test').connect_with_encoding('おはよう')
	const api = new Api(api_path, 'http://localhost:5173')
	expect(api_path.get_url(api)).toBe(
		'http://localhost:5173/api/test/%E3%81%8A%E3%81%AF%E3%82%88%E3%81%86'
	)
})