import { dev } from '$app/environment'
import { GOOGLE_PROJECT_ID, GOOGLE_LOCATION } from '$env/static/private'
import { TranslationServiceClient } from '@google-cloud/translate'
import { json, type RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	if (!dev) return json('dev only')

	console.info(url.href)

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

	console.log('start')

	const [operation] = await translation_client.createGlossary(request)
	console.log('start 2')

	await operation.promise()

	console.log('Created glossary:')
	console.log(`InputUri ${request.glossary.inputConfig.gcsSource.inputUri}`)

	return json('Success')
}
