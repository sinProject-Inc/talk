export class Util {
	public static split_sentences(text: string): string[] {
		const trimmed_text = text.trim()
		const replaced_text = trimmed_text.replace(/([.!?。！？])(\s+|([^.!?。！？]))/g, '$1\n$3')
		const sentences = replaced_text.split('\n')

		return sentences
	}

}
