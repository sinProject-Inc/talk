import { SoundDb } from '$lib/speech/sound/sound_db'
import { LocaleCode } from '$lib/language/locale_code'
import { SoundId } from '$lib/speech/sound/sound_id'
import { SpeechSound } from '$lib/speech/sound/speech_sound'
import type { Speech } from '$lib/speech/speech'
import { SpeechByGoogle } from '$lib/speech/speech_by_google'
import { SpeechByMicrosoft } from '$lib/speech/speech_by_microsoft'
import { SpeechText } from '$lib/speech/speech_text'
import type { RequestHandler } from '@sveltejs/kit'

function create_speech(speech_text: SpeechText, locale_code: LocaleCode): Speech {
	if (locale_code.use_microsoft_speech()) {
		console.info('use Microsoft Speech')
		return new SpeechByMicrosoft(speech_text, locale_code)
	} else {
		console.info('use Google Speech')
		return new SpeechByGoogle(speech_text, locale_code)
	}
}

async function get_speech_sounds(speech_texts: SpeechText[], locale_code: LocaleCode): Promise<SpeechSound[]> {
	const speech_sounds: SpeechSound[] = []

	for (const speech_text of speech_texts) {
		const sound_db = new SoundDb(locale_code, speech_text)
		const sound = await sound_db.find_first()

		if (sound) {
			try {
				const sound_id = new SoundId(sound.id)
				const speech_sound = SpeechSound.read(sound_id)

				console.info(`Found #${sound.id} sound for "${speech_text.text}"`)
				speech_sounds.push(speech_sound)
				continue
			} catch (e) {
				// DO NOTHING
			}
		}

		const speech = create_speech(speech_text, locale_code)
		const speech_sound = await speech.speak()
		const { id } = await sound_db.upsert()
		const sound_id = new SoundId(id)

		speech_sound.write(sound_id)
		console.info(`Created #${sound_id.id} sound for "${speech_text.text}"`)
		speech_sounds.push(speech_sound)
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

	return new Response(speech_sounds[0].data, {
		headers: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'audio/mp3',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': speech_sounds[0].length_string,
		},
	})
}
