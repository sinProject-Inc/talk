
export class Web {
	public static remove_children(html_element: HTMLElement): void {
		while (html_element.firstChild) {
			html_element.removeChild(html_element.firstChild)
		}
	}

	public static is_android(): boolean {
		return window.navigator.userAgent.toLowerCase().includes('android')
	}
}
