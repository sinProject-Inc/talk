export class App {
	public static localhost_origin = 'http://localhost:5173'
	public static app_name = 'Talk'
	public static company_and_app_name = 'sinProject Talk'
	public static description = 'This is a listening and speaking language learning app.'

	public static get_page_title(title: string): string {
		return `${title} - ${App.app_name}`
	}

	public static get_docs_title(title: string): string {
		return `${title} - ${App.company_and_app_name}`
	}
}
