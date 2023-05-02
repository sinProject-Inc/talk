import fs from 'fs'
import matter from 'gray-matter'
import { JSDOM } from 'jsdom'
import MarkdownIt from 'markdown-it'
import mdHighlightjs from 'markdown-it-highlightjs'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'

export type Page = {
	title: string
	path: string
}

export type Section = {
	title: string
	pages: Page[]
}

type PageSection = {
	level: number
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
				level: parseInt(heading.tagName[1]),
				title: text_content,
				slug,
			}

			sections.push(section)

			heading.classList.add('relative')
			heading.classList.add('section')

			heading.id = slug

			const link = document.createElement('a')
			link.href = `#${slug}`
			link.innerHTML = '#'
			link.classList.add('permalink')

			link.innerHTML =
				'<div><svg width="12" height="12" fill="none" aria-hidden="true"><path d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></div>'

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
			matcher(href: string) {
				return href.startsWith('http')
			},
			attrs: {
				target: '_blank',
				rel: 'noopener, noreferrer',
			},
		})

		md.use(mdHighlightjs)

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
