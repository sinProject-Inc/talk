import { expect, it } from 'vitest'
import { PinCode } from './pin_code'

it('undefined', () => {
	expect(() => {
		new PinCode(undefined)
	}).toThrow('PIN code is required')
})

it('[EMPTY]', () => {
	expect(() => {
		new PinCode('')
	}).toThrow('PIN code is required')
})

// test('short', () => {
// 	expect(() => {
// 		PinCode.generate(5)
// 	}).toThrow('PIN code is too short')
// })

it('just short enough', () => {
	expect(() => {
		PinCode.generate(6)
	}).not.toThrow()
})

it('just long enough', () => {
	expect(() => {
		PinCode.generate(50)
	}).not.toThrow()
})

it('long', () => {
	expect(() => {
		PinCode.generate(51)
	}).toThrow('PIN code is too long')
})

it('generate', () => {
	expect(PinCode.generate().code).toHaveLength(6)
})

it('generate 8', () => {
	expect(PinCode.generate(8).code).toHaveLength(8)
})

it('get_html have PIN code', () => {
	const pin_code = PinCode.generate()
	const code = pin_code.code
	const html = pin_code.get_html()

	expect(html).toContain(code)
})
