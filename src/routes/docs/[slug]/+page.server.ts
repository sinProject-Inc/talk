import { error } from '@sveltejs/kit'
import fs from 'fs'
import type { PageServerLoad } from './$types'
import { Markdown } from '$lib/docs/markdown'

const docs_base_dir = Markdown.docs_base_dir

export const load: PageServerLoad = async ({ params }) => {
	for (const sub_dir of fs.readdirSync(docs_base_dir)) {
		const sub_dir_path = `${docs_base_dir}/${sub_dir}`

		if (!fs.statSync(sub_dir_path).isDirectory()) continue

		for (const file of fs.readdirSync(sub_dir_path)) {
			if (file.slice(3, -3) === params.slug) {
				const file_path = `${sub_dir_path}/${file}`

				return {
					category: Markdown.get_section_title(sub_dir_path),
					file_path,
					page: Markdown.generate_page_content(file_path),
				}
			}
		}
	}

	throw error(404)
}
