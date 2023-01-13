import { ValueObject } from "../value_object";

export abstract class NumberValueObject extends ValueObject<number> {
	public override toString(): string {
		return this._value.toString()
	}
}
