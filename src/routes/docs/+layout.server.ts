import { base } from '$app/paths'
import { Markdown, type Page, type Section } from '$lib/docs/markdown'
import fs from 'fs'
import type { LayoutServerLoad } from './$types'

const docs_base_dir = Markdown.docs_base_dir
const pattern = /^\d\d-/

function get_page(file_path: string): Page {
	const page = Markdown.read_file(file_path)
	const file = file_path.split('/').pop()
	const slug = file?.slice(3, -3)

	return {
		title: page.title,
		path: `${base}/docs/${slug}`,
	}
}

function get_pages(sub_dir_path: string): Page[] {
	const pages: Page[] = []

	for (const file of fs.readdirSync(sub_dir_path)) {
		if (!pattern.test(file)) continue

		const file_path = `${sub_dir_path}/${file}`
		const page = get_page(file_path)

		pages.push(page)
	}

	return pages
}

function get_section(sub_dir_path: string): Section {
	const title = Markdown.get_section_title(sub_dir_path)
	const pages = get_pages(sub_dir_path)

	return {
		title,
		pages,
	}
}

export const load: LayoutServerLoad = async () => {
	const sections: Section[] = []

	for (const sub_dir of fs.readdirSync(docs_base_dir)) {
		const sub_dir_path = `${docs_base_dir}/${sub_dir}`

		if (!fs.statSync(sub_dir_path).isDirectory()) continue
		if (!pattern.test(sub_dir)) return

		const section = get_section(sub_dir_path)

		sections.push(section)
	}

	return { sections }
}
