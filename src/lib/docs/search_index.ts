/* eslint-disable no-console */
import fs from 'fs'
import * as glob from 'glob'
import matter from 'gray-matter'
import prettier from 'prettier'
import removeMd from 'remove-markdown'
import { Markdown } from './markdown'

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

			const file = file_path.split('/').pop()

			if (!file) throw new Error('File path is invalid')

			const slug = file.slice(3, -3)

			return { path: slug, title, description: description ?? '', content }
		})
	}

	public save(): void {
		const documents = this._load_markdown_files()

		const documents_without_markdown = this._remove_markdown(documents)

		const serialized_search_index = JSON.stringify(documents_without_markdown)
		const formatted_search_index = prettier.format(serialized_search_index, { parser: 'json' })

		// fs.writeFileSync(`${this._markdown_dir}/search_index.json`, formatted_search_index)
		fs.writeFileSync(`./src/lib/assets/search_index.json`, formatted_search_index)
	}

	private _remove_markdown(content: MarkdownData[]): MarkdownData[] {
		return content.map((item) => {
			return {
				...item,
				content: removeMd(item.content),
			}
		})
	}
}

new SearchIndex(Markdown.docs_base_dir).save()
