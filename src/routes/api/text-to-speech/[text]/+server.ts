import { SOUND_DIR } from '$env/static/private'
import { db } from '$lib/database'
import text_to_speech from '@google-cloud/text-to-speech'
import type { RequestHandler } from '@sveltejs/kit'
import fs from 'fs'

// HACK: 結合方法不明のため保留
// async function split_sentences(text: string, url: URL): Promise<string[]> {
// 	const split_response = await fetch(`${url.origin}/api/split-sentence/${text}`)
// 	const sentences = (await split_response.json()) as string[]

// 	return sentences
// }

async function fetch_audio(text: string): Promise<Buffer> {
	const request = {
		input: { text },
		voice: { languageCode: 'en-US', name: 'en-US-Neural2-C' },
		audioConfig: { audioEncoding: 'MP3' },
	}
	const text_to_speech_client = new text_to_speech.TextToSpeechClient()
	const [response] = await text_to_speech_client.synthesizeSpeech(request)

	return response.audioContent
}

async function upsert_data(sentence: string): Promise<number> {
	// TODO: language_code を指定する
	const language = await db.language.upsert({
		where: {
			code: 'en-US',
		},
		update: {},
		create: { code: 'en-US', name: 'English' },
	})

	const sound = await db.sound.upsert({
		where: {
			sound_text: sentence,
		},
		update: {},
		create: { language_id: language.id, sound_text: sentence },
	})

	return sound.id
}

async function get_buffers(sentences: string[]): Promise<Buffer[]> {
	const buffers: Buffer[] = []

	for (const sentence of sentences) {
		// console.log('sentence', sentence)
		const sound = await db.sound.findUnique({
			where: {
				sound_text: sentence,
			},
		})

		if (sound) {
			const read_path = `${SOUND_DIR}${sound.id}.mp3`

			try {
				const buffer = fs.readFileSync(read_path)

				console.info('found sound file', read_path)
				buffers.push(buffer)
				continue
			} catch (e) {
				console.info('not found sound file')
			}
		}

		const audio_content = await fetch_audio(sentence)
		const id = await upsert_data(sentence)
		const wright_path = `${SOUND_DIR}${id}.mp3`
		
		fs.writeFileSync(wright_path, audio_content, 'binary')
		console.info('write sound file', wright_path)
		buffers.push(audio_content)
	}

	return buffers
}

// export joinBase64Strings(base64_strings: string[]): string {

export const GET: RequestHandler = async ({ url, params }) => {
	const text = params.text ?? ''
	console.log(text)

	// const sentences = await split_sentences(text, url)
	// const buffers = await get_buffers(sentences)
	const buffers = await get_buffers([text])

	// // return new Response('success')

	return new Response(buffers[0], {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'audio/mp3',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': buffers[0].length.toString(),
		},
	})
}
