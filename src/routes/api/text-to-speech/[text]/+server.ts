import type { RequestHandler } from '@sveltejs/kit'
// import fs from 'fs'
import text_to_speech from '@google-cloud/text-to-speech'

export const GET: RequestHandler = async ({ params }) => {
	const text = params.text
	const request = {
		input: { text },
		voice: { languageCode: 'en-US', name: 'en-US-Neural2-C' },
		audioConfig: { audioEncoding: 'MP3' },
	}
	const text_to_speech_client = new text_to_speech.TextToSpeechClient()
	const [response] = await text_to_speech_client.synthesizeSpeech(request)

	// console.log(response.audioContent)
	// fs.writeFileSync('output.mp3', response.audioContent, 'binary')
	console.log(`'${text}' to speech`)

	return new Response(response.audioContent, {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'audio/mp3',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': response.audioContent.length,
		},
	})
}
