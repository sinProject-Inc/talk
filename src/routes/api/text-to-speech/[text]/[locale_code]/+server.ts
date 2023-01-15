import { Database } from '$lib/database'
import { File } from '$lib/file'
import { SpeechByGoogle } from '$lib/speech_by_google'
import { SpeechByMicrosoft } from '$lib/speech_by_microsoft'
import { SoundId } from '$lib/value/value_object/number_value_object/sound_id'
import { LocaleCode } from '$lib/value/value_object/string_value_object/locale_code'
import type { SpeechSound } from '$lib/value/value_object/string_value_object/speech_sound'
import { SpeechText } from '$lib/value/value_object/string_value_object/text_value_object/speech_text'
import type { RequestHandler } from '@sveltejs/kit'

async function speak_text(speech_text: SpeechText, locale_code: LocaleCode): Promise<SpeechSound> {
	if (locale_code.useMicrosoftSpeech()) {
		return await SpeechByMicrosoft.speak_text(speech_text, locale_code)
	} else {
		return await SpeechByGoogle.synthesize_speech(speech_text, locale_code)
	}
}

async function get_speech_sounds(speech_texts: SpeechText[], locale_code: LocaleCode): Promise<SpeechSound[]> {
	const speech_sounds: SpeechSound[] = []

	for (const speech_text of speech_texts) {
		// console.log('sentence', sentence)
		const sound = await Database.sound_find_by_text(speech_text, locale_code)

		if (sound) {
			try {
				const sound_id = new SoundId(sound.id)
				const speech_sound = File.read_sound(sound_id)

				console.info(`Found #${sound.id} sound for "${speech_text}"`)
				speech_sounds.push(speech_sound)
				continue
			} catch (e) {
				// DO NOTHING
			}
		}

		const audio_content = await speak_text(speech_text, locale_code)
		const { id } = await Database.sound_upsert(locale_code, speech_text)
		const sound_id = new SoundId(id)

		File.write_sound(sound_id, audio_content)
		console.info(`Created #${sound_id} sound for "${speech_text}"`)
		speech_sounds.push(audio_content)
	}

	return speech_sounds
}

export const GET: RequestHandler = async ({ url, params }) => {
	console.info(url.href)

	const text = params.text ?? ''
	const locale_code_string = params.locale_code ?? ''
	const locale_code = LocaleCode.create(locale_code_string)
	// console.info('text-to-speech: ', text)

	// const sentences = await split_sentences(text, url)
	// const buffers = await get_buffers(sentences)
	const speech_text = new SpeechText(text)
	const speech_sounds = await get_speech_sounds([speech_text], locale_code)

	// // return new Response('success')

	return new Response(speech_sounds[0].unit8_array, {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'audio/mp3',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': speech_sounds[0].length_string,
		},
	})
}
