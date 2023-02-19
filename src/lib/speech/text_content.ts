export class TextContent {
	public constructor(private readonly _text: string) {}

	public get text(): string {
		return this._text
	}
}