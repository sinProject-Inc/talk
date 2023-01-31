import { expect, test } from "vitest";
import { Api } from "./api";
import { ApiPath } from "./api_path";

test('[EMPTY]', () => {
	const api_path = ApiPath.api_directory
	const api = new Api(api_path)
	expect(api.origin).toBe('')
})
test('http://localhost:5173', () => {
	const api_path = ApiPath.api_directory
	const api = new Api(api_path, 'http://localhost:5173')
	expect(api.origin).toBe('http://localhost:5173')
})