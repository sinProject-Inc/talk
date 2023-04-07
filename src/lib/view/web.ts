export class Web {
	public static remove_children(html_element: HTMLElement): void {
		while (html_element.firstChild) {
			html_element.removeChild(html_element.firstChild)
		}
	}

	public static is_android(): boolean {
		return window.navigator.userAgent.toLowerCase().includes('android')
	}

	public static is_mobile_device(): boolean {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const user_agent = navigator.userAgent || navigator.vendor || (window as any).opera
		const mobile_regex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

		return mobile_regex.test(user_agent)
	}
}
