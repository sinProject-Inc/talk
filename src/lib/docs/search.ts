import Fuse from 'fuse.js'

type MarkdownData = {
	path: string
	title: string
	description: string
	content: string
}

export class Search {
	private _fuse_options: Fuse.IFuseOptions<MarkdownData> = {
		keys: ['title', 'description', 'content'],
		threshold: 0.0,
		ignoreLocation: true,
		includeScore: true,
		includeMatches: true,
	}

	private _fuse: Fuse<MarkdownData>

	public constructor(data: MarkdownData[]) {
		this._fuse = new Fuse(data, this._fuse_options)
	}

	public search(query: string): Fuse.FuseResult<MarkdownData>[] {
		const results = this._fuse.search(query)

		return results
	}
}
