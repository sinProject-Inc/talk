import { ValueObject } from "../value_object";

export abstract class StringValueObject extends ValueObject<string> {
	public override toString(): string {
		return this._value
	}
}
