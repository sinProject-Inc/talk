import { error } from '@sveltejs/kit'
import fs from 'fs'
import type { PageServerLoad } from './$types'
import { Markdown } from '$lib/view/markdown'

const docs_base_dir = Markdown.docs_base_dir

export const load: PageServerLoad = async ({ params }) => {
	for (const sub_dir of fs.readdirSync(docs_base_dir)) {
		if (!fs.statSync(`${docs_base_dir}/${sub_dir}`).isDirectory()) continue

		for (const file of fs.readdirSync(`${docs_base_dir}/${sub_dir}`)) {
			if (file.slice(3, -3) === params.slug) {
				const file_path = `${docs_base_dir}/${sub_dir}/${file}`

				return {
					category: Markdown.generate_category(sub_dir),
					page: Markdown.to_html(file_path),
				}
			}
		}
	}

	throw error(404)
}
