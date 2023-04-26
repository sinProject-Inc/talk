import fs from 'fs'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'
import { JSDOM } from 'jsdom'

export type Page = {
	title: string
	path: string
}

export type Section = {
	title: string
	pages: Page[]
}

type PageSection = {
	title: string
	slug: string
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

	public static generate_sections(source_html_content: string): {
		sections: PageSection[]
		html_content: string
	} {
		const jsdom = new JSDOM(source_html_content)
		const document = jsdom.window.document

		const headings = document.querySelectorAll('h2, h3, h4, h5, h6')

		const sections: PageSection[] = []

		headings.forEach((heading) => {
			const { textContent: text_content } = heading

			if (!text_content) return

			const slug = text_content
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/(^-|-$)+/g, '')

			const section: PageSection = {
				title: text_content,
				slug,
			}

			sections.push(section)

			heading.id = slug

			const link = document.createElement('a')
			link.href = `#${slug}`
			link.innerHTML = text_content
			link.classList.add('border-none')

			heading.innerHTML = ''
			heading.appendChild(link)
		})

		const html_content = document.body.innerHTML

		return { sections, html_content }
	}

	public static generate_page_content(file_path: string): {
		title: string
		description: string
		html_content: string
		sections: PageSection[]
	} {
		const { title, description, content } = this.read_file(file_path)

		const md = new MarkdownIt()

		md.use(MarkdownItLinkAttributes, {
			attrs: {
				target: '_blank',
				rel: 'noopener',
			},
		})

		const source_html_content = md.render(content)
		const { sections, html_content } = this.generate_sections(source_html_content)

		return { title, description, html_content, sections }
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
