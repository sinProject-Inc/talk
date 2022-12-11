import { Database } from '$lib/database'
import { File } from '$lib/file'
import { GoogleSpeech } from '$lib/google-speech'
import type { RequestHandler } from '@sveltejs/kit'

async function get_buffers(sentences: string[], locale_code: string): Promise<Buffer[]> {
	const buffers: Buffer[] = []

	for (const sentence of sentences) {
		// console.log('sentence', sentence)
		const sound = await Database.sound_find_by_text(sentence, locale_code)

		if (sound) {
			try {
				const buffer = File.read_sound(sound.id)

				console.info(`Found #${sound.id} sound for "${sentence}"`)
				buffers.push(buffer)
				continue
			} catch (e) {
				// DO NOTHING
			}
		}

		const audio_content = (await GoogleSpeech.synthesize_speech(sentence, locale_code)) as Buffer
		const {id: sound_id} = await Database.sound_upsert(sentence, locale_code)

		File.write_sound(sound_id, audio_content)
		console.info(`Created #${sound_id} sound for "${sentence}"`)
		buffers.push(audio_content)
	}

	return buffers
}

export const GET: RequestHandler = async ({ url, params }) => {
	console.log(url.href)

	const text = params.text ?? ''
	const locale_code = params.locale_code ?? ''
	// console.info('text-to-speech: ', text)

	// const sentences = await split_sentences(text, url)
	// const buffers = await get_buffers(sentences)
	const buffers = await get_buffers([text], locale_code)

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
