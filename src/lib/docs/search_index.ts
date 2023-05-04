/* eslint-disable no-console */
import fs from 'fs'
import * as glob from 'glob'
import matter from 'gray-matter'
import prettier from 'prettier'

export type MarkdownData = {
	path: string
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

			return { path: file_path, title, description, content }
		})
	}

	public save(): void {
		const documents = this._load_markdown_files()
		const serialized_search_index = JSON.stringify(documents)
		const formatted_search_index = prettier.format(serialized_search_index, { parser: 'json' })

		// fs.writeFileSync(`${this._markdown_dir}/search_index.json`, formatted_search_index)
		fs.writeFileSync(`./src/lib/assets/search_index.json`, formatted_search_index)
	}
}
