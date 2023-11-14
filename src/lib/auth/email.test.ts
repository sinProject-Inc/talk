import { expect, it } from 'vitest'
import { Email } from './email'

it('undefined', () => {
	expect(() => {
		new Email(undefined)
	}).toThrow('Email address is required')
})

it('[EMPTY]', () => {
	expect(() => {
		new Email('')
	}).toThrow('Email address is required')
})

it('iam..sin@gmail.com', () => {
	expect(() => {
		new Email('iam..sin@gmail.com')
	}).toThrow('Invalid email address')
})

it('iam.o.sin@gmail.com', () => {
	expect(new Email('iam.o.sin@gmail.com').address).toBe('iam.o.sin@gmail.com')
})
