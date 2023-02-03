import { expect, test } from "vitest";
import { PinCode } from "./pin_code";

test('undefined', () => {
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
		PinCode.generate(5)
	}).toThrow('PIN code is too short')
})

test('just short enough', () => {
	expect(() => {
		PinCode.generate(6)
	}).not.toThrow()
})

test('just long enough', () => {
	expect(() => {
		PinCode.generate(50)
	}).not.toThrow()
})

test('long', () => {
	expect(() => {
		PinCode.generate(51)
	}).toThrow('PIN code is too long')
})

test('generate', () => {
	expect(PinCode.generate().code).toHaveLength(6)
})

test('generate 8', () => {
	expect(PinCode.generate(8).code).toHaveLength(8)
})