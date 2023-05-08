/// <reference types="user-agent-data-types" />

export enum OS {
	mac_os = 'Mac OS',
	windows = 'Windows',
	ios = 'iOS',
	android = 'Android',
	linux = 'Linux',
	unknown = 'unknown',
}

export class OSInfo {
	private readonly _macos_platforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'Mac', 'macOS']
	private readonly _windows_platforms = ['Win32', 'Win64', 'Windows', 'WinCE']
	private readonly _ios_platforms = ['iPhone', 'iPad', 'iPod']

	public get_os(): OS {
		const user_agent = window.navigator.userAgent
		const platform = navigator?.userAgentData?.platform || navigator?.platform

		if (this._macos_platforms.includes(platform)) {
			return OS.mac_os
		}

		if (this._ios_platforms.includes(platform)) {
			return OS.ios
		}

		if (this._windows_platforms.includes(platform)) {
			return OS.windows
		}

		if (/Android/.test(user_agent)) {
			return OS.android
		}

		if (/Linux/.test(platform)) {
			return OS.linux
		}

		return OS.unknown
	}
}
