import Fuse from 'fuse.js'

// TODO: Move this to a shared location
interface MarkdownData {
	path: string
	title: string
	description: string
	content: string
}

export interface Context {
	full_context: string
	split_context: {
		before_match: string
		matched_text: string
		after_match: string
	}
}

export class Search {
	// TODO: Move this to a shared location
	private _fuse_options: Fuse.IFuseOptions<MarkdownData> = {
		keys: ['title', 'description', 'content'],
		threshold: 0.4,
		includeScore: true,
		includeMatches: true,
	}
	private _fuse: Fuse<MarkdownData>

	public constructor(data: MarkdownData[]) {
		this._fuse = new Fuse(data, this._fuse_options)
	}

	public search(query: string): Fuse.FuseResult<MarkdownData>[] {
		return this._fuse.search(query)
	}

	public get_context(result: Fuse.FuseResult<MarkdownData>, context_length = 300): Context {
		const content = result.item.content
		const match = result.matches?.find((match) => match.key === 'content')

		if (!match) {
			return {
				full_context: '',
				split_context: {
					before_match: '',
					matched_text: '',
					after_match: '',
				},
			}
		}

		const start_index = Math.max(0, match.indices[0][0] - context_length)
		const end_index = Math.min(content.length, match.indices[0][1] + context_length)

		const match_start = match.indices[0][0]
		const match_end = match.indices[0][1] + 1

		const before_match = content.substring(start_index, match_start)
		const matched_text = content.substring(match_start, match_end)
		const after_match = content.substring(match_end, end_index)

		const full_context = `${before_match}${matched_text}${after_match}`

		return {
			full_context,
			split_context: {
				before_match,
				matched_text,
				after_match,
			},
		}
	}
}
