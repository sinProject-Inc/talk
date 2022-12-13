export class Lang {
	public static to_text_language_code(locale_code: string): string {
		const language_code = locale_code.split('-')[0] ?? locale_code
		const language_code2 = language_code === 'yue' ? 'zh-TW' : language_code
		
		return language_code2
	}
}
