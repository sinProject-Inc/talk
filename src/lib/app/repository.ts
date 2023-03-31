import type { AuthPinRepository } from '$lib/auth/auth_pin_repository'
import { AuthPinRepositoryPrisma } from '$lib/auth/auth_pin_repository_prisma'
import type { AuthTokenRepository } from '$lib/auth/auth_token_repository'
import { AuthTokenRepositoryPrisma } from '$lib/auth/auth_token_repository_prisma'
import type { SignInLogRepository } from '$lib/auth/sign_in_log_repository'
import { SignInLogRepositoryPrisma } from '$lib/auth/sign_in_log_repository_prisma'
import type { UserRepository } from '$lib/auth/user_repository'
import { UserRepositoryPrisma } from '$lib/auth/user_repository_prisma'
import type { ChatLogRepository } from '$lib/chat/chat_log_repository'
import { ChatLogRepositoryPrisma } from '$lib/chat/chat_log_repository_prisma'
import type { LocaleRepository } from '$lib/locale/locale_repository'
import { LocaleRepositoryPrisma } from '$lib/locale/locale_repository_prisma'
import type { SoundRepository } from '$lib/speech/sound/sound_repository'
import { SoundRepositoryPrisma } from '$lib/speech/sound/sound_repository_prisma'
import type { VoiceRepository } from '$lib/speech/voice/voice_repository'
import { VoiceRepositoryPrisma } from '$lib/speech/voice/voice_repository_prisma'
import type { TextRepository } from '$lib/text/text_repository'
import { TextRepositoryPrisma } from '$lib/text/text_repository_prisma'
import type { TranslationRepository } from '$lib/translation/translation_repository'
import { TranslationRepositoryPrisma } from '$lib/translation/translation_repository_prisma'
import { PrismaClient } from '@prisma/client'
import type { AppSettingRepository } from './app_setting_repository'
import { AppSettingRepositoryPrisma } from './app_setting_repository_prisma'

export class Repository {
	private static _context = new PrismaClient()

	public static get context(): PrismaClient {
		return Repository._context
	}

	public static app_setting: AppSettingRepository = new AppSettingRepositoryPrisma(this._context)
	public static auth_token: AuthTokenRepository = new AuthTokenRepositoryPrisma(this._context)
	public static auth_pin: AuthPinRepository = new AuthPinRepositoryPrisma(this._context)
	public static locale: LocaleRepository = new LocaleRepositoryPrisma(this._context)
	public static text: TextRepository = new TextRepositoryPrisma(this._context)
	public static translation: TranslationRepository = new TranslationRepositoryPrisma(this._context)
	public static sound: SoundRepository = new SoundRepositoryPrisma(this._context)
	public static user: UserRepository = new UserRepositoryPrisma(this._context)
	public static chat_log: ChatLogRepository = new ChatLogRepositoryPrisma(this._context)
	public static voice: VoiceRepository = new VoiceRepositoryPrisma(this._context)
	public static sign_in_log: SignInLogRepository = new SignInLogRepositoryPrisma(this._context)
}
