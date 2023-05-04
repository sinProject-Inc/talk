import type Fuse from 'fuse.js'

export interface SplitContextPortion {
	text: string
	is_match: boolean
	string_index: number
}

interface IndexRange {
	start: number
	end: number
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

		let last_index = 0

		for (const match of text.matchAll(regex)) {
			if (!match.index) continue

			if (match.index > last_index) {
				split_context.push({
					text: text.slice(last_index, match.index),
					is_match: false,
					string_index: last_index,
				})
			}

			split_context.push({
				text: match[0],
				is_match: true,
				string_index: match.index,
			})

			last_index = match.index + match[0].length
		}

		if (last_index < text.length) {
			split_context.push({
				text: text.slice(last_index),
				is_match: false,
				string_index: last_index,
			})
		}

		return split_context
	}

	public shorten_split_context(
		split_context: SplitContextPortion[],
		max_length: number
	): SplitContextPortion[] {
		if (!this._match.value) return []

		const text = this._match.value

		const first_matching_portion = split_context.find((portion) => portion.is_match)

		if (!first_matching_portion) return []

		const index_range = this._get_shortened_index_range(text, first_matching_portion, max_length)

		const starting_portion =
			split_context.find((portion) => {
				return this._is_index_in_portion(portion, index_range.start)
			}) ?? split_context[0]

		const ending_portion =
			split_context.find((portion) => {
				return this._is_index_in_portion(portion, index_range.end)
			}) ?? split_context[split_context.length - 1]

		const starting_portion_shortened = {
			...starting_portion,
			text: `${starting_portion.text.slice(
				index_range.start - starting_portion.string_index,
				starting_portion.text.length
			)}`,
		}

		const ending_portion_shortened = {
			...ending_portion,
			text: ending_portion.text.slice(0, index_range.end - ending_portion.string_index),
		}

		const middle_portions = split_context.filter((portion) => {
			return (
				portion.string_index > starting_portion.string_index &&
				portion.string_index < ending_portion.string_index
			)
		})

		const shortened_context = [
			starting_portion_shortened,
			...middle_portions,
			ending_portion_shortened,
		]

		return shortened_context
	}

	private _get_shortened_index_range(
		text: string,
		matching_portion: SplitContextPortion,
		max_length: number
	): IndexRange {
		const match_length = matching_portion.text.length
		const remaining_length = max_length - match_length

		if (remaining_length <= 0) {
			const start = matching_portion.string_index
			const end = matching_portion.string_index + match_length

			return { start, end }
		}

		const left_length = Math.floor(remaining_length / 2)
		const right_length = remaining_length - left_length

		let start = matching_portion.string_index - left_length
		let end = matching_portion.string_index + match_length + right_length

		if (start < 0) {
			end += Math.abs(start)
			start = 0
		}

		if (end > text.length) {
			const overflow = end - text.length
			start -= overflow

			if (start >= 0) {
				start = 0
			}
		}

		return { start, end }
	}

	private _is_index_in_portion(portion: SplitContextPortion, index: number): boolean {
		const portion_start_index = portion.string_index
		const portion_end_index = portion.string_index + portion.text.length

		const is_in_portion = portion_start_index <= index && index <= portion_end_index

		return is_in_portion
	}
}
