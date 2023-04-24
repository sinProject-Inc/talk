/* eslint-disable no-console */
import fs from 'fs'
import Fuse from 'fuse.js'
import * as glob from 'glob'
import matter from 'gray-matter'
import { Markdown } from './markdown'
import prettier from 'prettier'

type MarkdownData = {
	path: string
	title: string
	description: string
	content: string
}

export class SearchIndex {
	public static options: Fuse.IFuseOptions<MarkdownData> = {
		keys: ['title', 'description', 'content'],
		// threshold: 0.2,
		// includeScore: true,
	}

	public constructor(private readonly _markdown_dir: string) {}

	private _load_markdown_files(): MarkdownData[] {
		const markdown_file_paths = glob.sync(`${this._markdown_dir}/**/*.md`)

		return markdown_file_paths.map((file_path) => {
			const file_content = fs.readFileSync(file_path, 'utf8')
			const { data: metadata, content } = matter(file_content)
			const { title, description } = metadata
			// const path = path.relative(this._markdown_dir, file_path)

			return { path: file_path, title, description, content }
		})
	}

	private _create(): Fuse.FuseIndex<MarkdownData> {
		const markdown_files = this._load_markdown_files()

		const fuse = new Fuse(markdown_files, SearchIndex.options)
		const index = fuse.getIndex()

		return index
	}

	public save(): void {
		const search_index = this._create()
		const serialized_search_index = JSON.stringify(search_index.toJSON())
		const formatted_search_index = prettier.format(serialized_search_index, { parser: 'json' })

		fs.writeFileSync(`${this._markdown_dir}/search_index.json`, formatted_search_index)
	}
}

new SearchIndex(Markdown.docs_base_dir).save()
// eslint-disable-next-line no-console
console.log('Search index created')

const index_data = fs.readFileSync(`${Markdown.docs_base_dir}/search_index.json`, 'utf8')
const index = Fuse.parseIndex(JSON.parse(index_data))

const fuse = new Fuse([], SearchIndex.options, index)

const results = fuse.search('Introduction')

results.forEach((result) => {
	console.log(result)
})
