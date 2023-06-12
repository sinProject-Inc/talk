import fs from 'fs'
import matter from 'gray-matter'
import { JSDOM } from 'jsdom'
import MarkdownIt from 'markdown-it'
// import mdHighlightjs from 'markdown-it-highlightjs'
import MarkdownItLinkAttributes from 'markdown-it-link-attributes'
import hljs from 'highlight.js'

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

const github_url = 'https://github.com/sinProject-Inc/talk/blob/main/'

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
			heading.classList.add('slide-fade-in')

			heading.id = slug

			const link = document.createElement('a')
			link.href = `#${slug}`
			link.innerHTML = '#'
			link.classList.add('permalink')
			link.title = text_content

			link.innerHTML =
				'<div><svg width="12" height="12" fill="none" aria-hidden="true"><path d="M3.75 1v10M8.25 1v10M1 3.75h10M1 8.25h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg></div>'

			heading.appendChild(link)
		})

		const html_content = document.body.innerHTML

		return { sections, html_content }
	}

	public static code_block_name_plugin(md: MarkdownIt): void {
		md.set({
			highlight: function (str: string, lang: string) {
				if (lang && hljs.getLanguage(lang)) {
					try {
						return hljs.highlight(str, { language: lang }).value
					} catch (__) {
						// DO NOTHING
					}
				}

				return '' // use external default escaping
			},
		})

		md.renderer.rules.fence = function (tokens, idx): string {
			const token = tokens[idx]
			const [lang, filename] = (token.info || '').split(':')

			let highlighted_code = ''

			if (lang && hljs.getLanguage(lang)) {
				try {
					highlighted_code = hljs.highlight(token.content, { language: lang }).value
				} catch (__) {
					// DO NOTHING
				}
			} else {
				highlighted_code = md.utils.escapeHtml(token.content)
			}

			const github_icon_element = `
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon icon-tabler icon-tabler-brand-github"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
						d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
						fill="none"
					/>
				</svg>
			`

			const title_element = filename
				? `
					<a class="code-title flex gap-1.5 items-center font-semibold dark:text-primary-dark-3 text-primary-3 dark:hover:text-primary-dark-4 hover:text-primary-10" href="${github_url}${filename}" target="blank">
						<div style="width:20px">
							${github_icon_element}
						</div>
						${filename}
					</a>
				`
				: `
					<div class="code-title flex gap-1.5 items-center font-semibold dark:text-primary-dark-3 text-primary-3">
						<div style="width:20px">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="icon icon-tabler icon-tabler-terminal-2"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M8 9l3 3l-3 3" fill="none" />
								<path d="M13 15l3 0" fill="none" />
								<path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" fill="none" />
							</svg>
						</div>
						${hljs.getLanguage(lang)?.name}
					</div>
				`

			const code_header_element = `
				<div class="flex gap-2 justify-between">
					${title_element}
					<button data-testid="copy-code" class="copy-code flex gap-1.5 items-center font-semibold dark:text-primary-dark-3 text-primary-3 ">
						<div class="h-[33px] w-[33px] rounded-full glass-bump-bg-shine active:scale-125 -m-[6.5px] p-[6.5px]"
						style="transition-duration: 350ms;">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="icon icon-tabler icon-tabler-copy"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								fill="none"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path
									d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
									fill="none"
								/>
								<path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" fill="none" />
							</svg>
						</div>
					</button>
				</div>
			`

			return `<div class="code-container">${code_header_element}<pre><code class="hljs ${lang}">${highlighted_code}</code></pre></div>`
		}
	}

	public static github_link_plugin(md: MarkdownIt): void {
		const github_icon = `
			<svg
				xmlns="http://www.w3.org/2000/svg"
					class="icon icon-tabler icon-tabler-brand-github"
					style="width: 24px; height: 24px; stroke: currentColor; fill: none; margin-right: 4px; margin-bottom: 2px;"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path
							d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
							fill="none"
					/>
				</svg>
			`

		const right_arrow = `
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6" aria-hidden="true"
				class="icon icon-tabler icon-tabler-brand-github-filled"
				style="width: 8px; height: 8px; stroke: currentColor; fill: none; margin-left: 8px; margin-bottom: 6px;"
				width="8"
				height="8">
				<path d="M0 0L3 3L0 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
		`

		md.renderer.rules.text = function (tokens, idx): string {
			const text = tokens[idx].content
			let string_after_render = text

			// TODO: replace ">" to arrow
			if (text.includes('&gt;')) {
				const cut_text = text.replace('&gt;', '')

				string_after_render = `
					<div style="display: flex; flex-direction: row;">
						<div class="link-with-arrow">
							${cut_text}
						</div>
					</div>
				`
			}

			if (text.includes('on GitHub >')) {
				const cut_text = text.replace('on GitHub >', '')

				string_after_render = `
					<div style="display: flex; flex-direction: row;">
						<div style="display: flex; align-items: end;">
							${github_icon}
							${cut_text}
							${right_arrow}
						</div>
					</div>
				`
			}

			return string_after_render
		}
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

		// md.use(mdHighlightjs)
		md.use(Markdown.code_block_name_plugin)
		md.use(Markdown.github_link_plugin)

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
