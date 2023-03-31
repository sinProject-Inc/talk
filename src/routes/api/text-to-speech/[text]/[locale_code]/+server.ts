import { logger } from '$lib/app/logger'
import { Repository } from '$lib/app/repository'
import { LocaleCode } from '$lib/locale/locale_code'
import { SoundId } from '$lib/speech/sound/sound_id'
import { SpeechSound } from '$lib/speech/sound/speech_sound'
import type { Speech } from '$lib/speech/speech'
import { SpeechByGoogle } from '$lib/speech/speech_by_google'
import { SpeechByMicrosoft } from '$lib/speech/speech_by_microsoft'
import { SpeechText } from '$lib/speech/speech_text'
import type { RequestHandler } from '@sveltejs/kit'

async function create_speech(speech_text: SpeechText, locale_code: LocaleCode): Promise<Speech> {
	const voice_locale = await Repository.voice.find_first_by_locale_code(locale_code)

	if (!voice_locale) throw new Error(`voice not found: ${locale_code}}`)

	if (voice_locale.target === 'microsoft') return new SpeechByMicrosoft(speech_text, voice_locale)
	if (voice_locale.target === 'google') return new SpeechByGoogle(speech_text, voice_locale)

	throw new Error(`voice target not found: ${voice_locale.target}`)
}

async function get_speech_sounds(
	speech_texts: SpeechText[],
	locale_code: LocaleCode
): Promise<SpeechSound[]> {
	const speech_sounds: SpeechSound[] = []

	for (const speech_text of speech_texts) {
		const sound = await Repository.sound.find_first(locale_code, speech_text)

		if (sound) {
			try {
				const sound_id = new SoundId(sound.id)
				const speech_sound = await SpeechSound.read(sound_id)

				logger.info(`Found #${sound.id} sound for ${speech_text.text}`)
				speech_sounds.push(speech_sound)
				continue
			} catch (e) {
				// DO NOTHING
			}
		}

		const speech = await create_speech(speech_text, locale_code)
		const speech_sound = await speech.speak()
		const { id } = await Repository.sound.save(locale_code, speech_text)
		const sound_id = new SoundId(id)

		await speech_sound.write(sound_id)

		logger.info(`Created #${sound_id.id} sound for ${speech_text.text}`)

		speech_sounds.push(speech_sound)
	}

	return speech_sounds
}

export const GET: RequestHandler = async ({ params }) => {
	const speech_text = new SpeechText(params.text)
	const locale_code = new LocaleCode(params.locale_code)

	try {
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
	} catch (err) {
		logger.error(`[speech] Failed to speech text: ${params.text}]`, err)

		if (err instanceof Error) {
			return new Response(err.message, { status: 500 })
		}

		return new Response('undefined', { status: 500 })
	}
}
