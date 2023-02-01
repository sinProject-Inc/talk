import { expect, test } from "vitest";
import { PinCode } from "./pin_code";

test('undefinee', () => {
	expect(() => {
		new PinCode(undefined)
	}).toThrow('PIN code is required')
})

test('[EMPTY]', () => {
	expect(() => {
		new PinCode('')
	}).toThrow('PIN code is required')
})

test('short', () => {
	expect(() => {
		new PinCode('12345')
	}).toThrow('PIN code is too short')
})

test('generate', () => {
	expect(PinCode.generate().code.length).toBe(6)
})

test('generate 8', () => {
	expect(PinCode.generate(8).code.length).toBe(8)
})