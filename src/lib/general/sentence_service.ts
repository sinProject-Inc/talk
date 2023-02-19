export class SentenceService {
	public constructor(private readonly _value: string) {}

	public split(): string[] {
		const trimmed_text = this._value.trim()
		const replaced_text = trimmed_text.replace(/([.!?。！？])(\s+|([^.!?。！？]))/g, '$1\n$3')
		const sentences = replaced_text.split('\n')

		return sentences
	}
}
