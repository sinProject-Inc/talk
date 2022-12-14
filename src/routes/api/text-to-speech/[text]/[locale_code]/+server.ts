import { Database } from '$lib/database'
import { File } from '$lib/file'
import { SpeechByGoogle } from '$lib/speech_by_google'
import { SpeechByMicrosoft } from '$lib/speech_by_microsoft'
import type { RequestHandler } from '@sveltejs/kit'

async function speak_text(text: string, locale_code: string): Promise<Uint8Array> {
	if (locale_code === 'km-KH') {
		return await SpeechByMicrosoft.speak_text(text, locale_code)
	} else {
		return await SpeechByGoogle.synthesize_speech(text, locale_code)
	}
}

async function get_uint8arrays(sentences: string[], locale_code: string): Promise<Uint8Array[]> {
	const uint8Arrays: Uint8Array[] = []

	for (const sentence of sentences) {
		// console.log('sentence', sentence)
		const sound = await Database.sound_find_by_text(sentence, locale_code)

		if (sound) {
			try {
				const buffer = File.read_sound(sound.id)

				console.info(`Found #${sound.id} sound for "${sentence}"`)
				uint8Arrays.push(buffer)
				continue
			} catch (e) {
				// DO NOTHING
			}
		}

		const audio_content = await speak_text(sentence, locale_code)
		const { id: sound_id } = await Database.sound_upsert(locale_code, sentence)

		File.write_sound(sound_id, audio_content)
		console.info(`Created #${sound_id} sound for "${sentence}"`)
		uint8Arrays.push(audio_content)
	}

	return uint8Arrays
}

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const text = params.text ?? ''
	const locale_code = params.locale_code ?? ''
	// console.info('text-to-speech: ', text)

	// const sentences = await split_sentences(text, url)
	// const buffers = await get_buffers(sentences)
	const uint8arrays = await get_uint8arrays([text], locale_code)

	// // return new Response('success')

	return new Response(uint8arrays[0], {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'audio/mp3',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': uint8arrays[0].length.toString(),
		},
	})
}
