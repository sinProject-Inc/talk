import { SpeechLanguageCode } from "$lib/speech/speech_language_code";
import { expect, test } from "vitest";
import { AppLocaleCode } from "./app_locale_code";

test('default', () => {
	expect(AppLocaleCode.default.code).toBe('en')
})

test('chinese_taiwan', () => {
	expect(AppLocaleCode.chinese_taiwan.code).toBe('zh-TW')
})

test('undefined', () => {
	expect(new AppLocaleCode(undefined).code).toBe('en')
})

test('[BLANK]', () => {
	expect(new AppLocaleCode('').code).toBe('en')
})

test('[SPACE]', () => {
	expect(new AppLocaleCode(' ').code).toBe('en')
})

test('ja-JP', () => {
	expect(new AppLocaleCode('ja-JP').code).toBe('ja')
})

test('from ja language code', () => {
	const speech_language_code = SpeechLanguageCode.japanese
	expect(AppLocaleCode.from_speech_language_code(speech_language_code).code).toBe('ja')
})
test('from yue language code', () => {
	const speech_language_code = SpeechLanguageCode.yue_chinese
	expect(AppLocaleCode.from_speech_language_code(speech_language_code).code).toBe('zh-TW')
})