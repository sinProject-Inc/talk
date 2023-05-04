import type Fuse from 'fuse.js'

export interface SplitContextPortion {
	text: string
	is_match: boolean
	string_index: number
}

export class SearchResultContext {
	private readonly _match: Fuse.FuseResultMatch
	private readonly _query: string

	public constructor(match: Fuse.FuseResultMatch, query: string) {
		this._match = match
		this._query = query
	}

	public get_split_context(): SplitContextPortion[] {
		if (!this._match.value) return []

		const text = this._match.value
		const regex = new RegExp(this._query, 'gi')
		const split_context: SplitContextPortion[] = []
		const split_text = text.split(this._query)

		split_text.forEach((portion, index) => {
			split_context.push({ text: portion, is_match: false, string_index: index })
			if (index < split_text.length - 1) {
				const match = regex.exec(text)
				if (match) {
					split_context.push({ text: match[0], is_match: true, string_index: index })
				}
			}
		})

		const shortened_split_context = this.shorten_split_context(split_context, 2, 10)

		return shortened_split_context
	}

	public shorten_split_context(
		split_context: SplitContextPortion[],
		max_length: number,
		max_prefix_length: number
	): SplitContextPortion[] {
		const shortened_context: SplitContextPortion[] = []

		let total_length = 0
		let match_index = this.find_next_match(split_context, 0)

		while (match_index >= 0 && total_length < max_length) {
			const next_match_index = this.find_next_match(split_context, match_index + 1)

			if (next_match_index >= 0) {
				const distance = this.calculate_distance(split_context, match_index, next_match_index)

				if (distance <= max_length) {
					this.add_portions(shortened_context, split_context, match_index, next_match_index)
					total_length += distance
				} else {
					this.add_prefix(
						shortened_context,
						split_context,
						match_index,
						max_prefix_length,
						max_length - total_length
					)
					total_length = max_length
				}

				match_index = next_match_index
			} else {
				this.add_remaining_portions(
					shortened_context,
					split_context,
					match_index,
					max_length - total_length
				)
				total_length = max_length
			}
		}

		return shortened_context
	}

	public find_next_match(split_context: SplitContextPortion[], start: number): number {
		for (let i = start; i < split_context.length; i++) {
			if (split_context[i].is_match) {
				return i
			}
		}

		return -1
	}

	public calculate_distance(
		split_context: SplitContextPortion[],
		start: number,
		end: number
	): number {
		let distance = 0
		for (let i = start; i <= end; i++) {
			distance += split_context[i].text.length
		}
		return distance
	}

	public add_portions(
		target: SplitContextPortion[],
		source: SplitContextPortion[],
		start: number,
		end: number
	): void {
		for (let i = start; i <= end; i++) {
			target.push(source[i])
		}
	}

	public add_prefix(
		target: SplitContextPortion[],
		source: SplitContextPortion[],
		match_index: number,
		max_prefix_length: number,
		available_length: number
	): void {
		const prefix_length = Math.min(
			source[match_index - 1].text.length,
			max_prefix_length,
			available_length
		)
		const prefix_text = source[match_index - 1].text.slice(-prefix_length)
		target.push({ text: prefix_text, is_match: false }, source[match_index])
	}

	public add_remaining_portions(
		target: SplitContextPortion[],
		source: SplitContextPortion[],
		start: number,
		available_length: number
	): void {
		let remaining_length = available_length
		for (let i = start; i < source.length && remaining_length > 0; i++) {
			const portion_length = Math.min(source[i].text.length, remaining_length)
			target.push({ text: source[i].text.slice(0, portion_length), is_match: source[i].is_match })
			remaining_length -= portion_length
		}
	}
}
