import { dev } from '$app/environment'
import { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } from '$env/static/private'
import { logger } from '$lib/app/logger'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	if (!dev) return json('dev only')

	const glossary_id = 'glossary'
	// const glossary_id = params.glossary_id?.trim() ?? ''
	// if (glossary_id === '') return json('')

	const translation_client = new TranslationServiceClient()

	const glossary = {
		languageCodesSet: {
			languageCodes: ['en', 'ja'],
		},
		inputConfig: {
			gcsSource: {
				inputUri: 'gs://talk-translation/glossary.csv',
			},
		},
		name: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/glossaries/${glossary_id}`,
	}

	const request = {
		parent: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}`,
		glossary,
	}

	const [operation] = await translation_client.createGlossary(request)

	await operation.promise()

	return json('Success')
}
