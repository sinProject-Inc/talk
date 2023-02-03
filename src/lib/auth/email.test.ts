import { expect, test } from 'vitest'
import { Email } from './email'

test('undefined', () => {
	expect(() => {
		new Email(undefined)
	}).toThrow('Email address is required')
})

test('[EMPTY]', () => {
	expect(() => {
		new Email('')
	}).toThrow('Email address is required')
})

test('iam..sin@gmail.com', () => {
	expect(() => {
		new Email('iam..sin@gmail.com')
	}).toThrow('Invalid email address')
})

test('iam.o.sin@gmail.com', () => {
	expect(new Email('iam.o.sin@gmail.com').address).toBe('iam.o.sin@gmail.com')
})