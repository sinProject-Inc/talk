import { Database } from '$lib/database'
import { File } from '$lib/file'
import { GoogleSpeech } from '$lib/google-speech'
import type { RequestHandler } from '@sveltejs/kit'

async function get_buffers(sentences: string[]): Promise<Buffer[]> {
	const buffers: Buffer[] = []

	for (const sentence of sentences) {
		// console.log('sentence', sentence)
		const sound = await Database.sound_find_by_text(sentence)

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

		// TODO: locale を指定する
		const audio_content = (await GoogleSpeech.synthesize_speech(sentence, 'en-US')) as Buffer
		// TODO: locale_id を指定する
		const {id: sound_id} = await Database.sound_upsert(sentence, 1)

		File.write_sound(sound_id, audio_content)
		console.info(`Created #${sound_id} sound for "${sentence}"`)
		buffers.push(audio_content)
	}

	return buffers
}

export const GET: RequestHandler = async ({ params }) => {
	const text = params.text ?? ''
	// console.info('text-to-speech: ', text)

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
