import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'

export type Page = {
	title: string
	path: string
}

export type Section = {
	title: string
	pages: Page[]
}

export class Markdown {
	public static docs_base_dir = './docs'

	public static read_file(file_path: string): {
		title: string
		description: string
		content: string
	} {
		const file_content = fs.readFileSync(file_path, 'utf8')
		const { data: metadata, content } = matter(file_content)
		const { title, description } = metadata

		return { title, description, content }
	}

	public static to_html(file_path: string): {
		title: string
		description: string
		html_content: string
	} {
		const { title, description, content } = this.read_file(file_path)

		const md = new MarkdownIt()

		md.use(MarkdownItLinkAttributes, {
			attrs: {
				target: '_blank',
				rel: 'noopener',
			},
		})

		const html_content = md.render(content)

		return { title, description, html_content }
	}

	public static generate_category(input: string): string {
		const result = input
			.split('-')
			.slice(1)
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(' ')

		return result
	}
}
