/* eslint-disable no-console */
import fs from 'fs'
import * as glob from 'glob'
import matter from 'gray-matter'
import { Markdown } from './markdown'
import prettier from 'prettier'
import MiniSearch from 'minisearch'

type MarkdownData = {
	id: string
	title: string
	description: string
	content: string
}

export class SearchIndex {
	public constructor(private readonly _markdown_dir: string) {}

	private _load_markdown_files(): MarkdownData[] {
		const markdown_file_paths = glob.sync(`${this._markdown_dir}/**/*.md`)

		return markdown_file_paths.map((file_path) => {
			const file_content = fs.readFileSync(file_path, 'utf8')
			const { data: metadata, content } = matter(file_content)
			const { title, description } = metadata
			// const path = path.relative(this._markdown_dir, file_path)

			return { id: file_path, title, description, content }
		})
	}

	private _create(): MiniSearch<MarkdownData> {
		const markdown_files = this._load_markdown_files()

		const mini_search = new MiniSearch({
			fields: ['title', 'description', 'content'],
			storeFields: ['path', 'title', 'description'],
		})

		mini_search.addAll(markdown_files)

		return mini_search
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
const mini_search = MiniSearch.loadJSON(index_data, { fields: ['title', 'description', 'content'] })

mini_search.search('intro', { prefix: true, fuzzy: 0.2 }).forEach((result) => {
	console.log('result', result)
})
