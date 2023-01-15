// NOTE: TypeScriptでValueObjectの表現を考えてみた https://qiita.com/rokumura7/items/2f68643cd5086917037a
// NOTE: AbstractValueObjectクラスの実装 https://blog.mamansoft.net/2020/02/19/express-value-object-by-typescript/
// NOTE: DDDで値オブジェクトを生成するときってその場でnewで良いの？https://qiita.com/kwhrkzk/items/250d41301b5f469fe072
// NOTE: TypeScriptで値オブジェクトを表現する https://blog.mamansoft.net/2020/02/19/express-value-object-by-typescript/

export type PreferNominal = never

export abstract class ValueObject<T> {
	protected constructor(protected readonly _value: T) {}

	public equals(other: ValueObject<T>): boolean {
		if (this.constructor.name != other.constructor.name) return false
		return this._value === other._value
	}

	public get string(): string {
		return this.toString()
	}
}
