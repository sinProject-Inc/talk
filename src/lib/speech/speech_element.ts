import type { TextContent } from './text_content'

export interface SpeechElement {
	show_hint(): void
	set text_content(text_content: TextContent)
}
