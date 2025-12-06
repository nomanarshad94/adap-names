import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter !== undefined && delimiter !== null && delimiter.length > 0, "delimiter must not be empty");
        this.delimiter = delimiter;
        this.assertClassInvariants();
    }

    // @methodtype factory-method
    public clone(): Name {
        const clone = Object.create(this);
        MethodFailedException.assert(clone.isEqual(this), "clone must be equal to original");
        return clone;
    }

    /**
     * Returns a human-readable representation of the Name instance
     * Special characters are not escaped (creating a human-readable string)
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assert(delimiter !== undefined && delimiter !== null && delimiter.length > 0, "delimiter must not be empty");

        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            parts.push(this.unmaskComponent(this.getComponent(i), this.delimiter));
        }
        return parts.join(delimiter);
    }

    // @methodtype conversion-method
    public toString(): string {
        return this.asDataString();
    }

    /**
     * Returns a machine-readable representation using default special characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        const parts: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            let component = this.getComponent(i);
            if (this.delimiter !== DEFAULT_DELIMITER) {
                // Convert masking from current delimiter to default delimiter
                component = this.maskComponent(
                    this.unmaskComponent(component, this.delimiter),
                    DEFAULT_DELIMITER
                );
            }
            parts.push(component);
        }
        return parts.join(DEFAULT_DELIMITER);
    }

    // @methodtype boolean-query-method
    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        if (this.getDelimiterCharacter() !== other.getDelimiterCharacter()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    // @methodtype get-method
    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    // @methodtype boolean-query-method
    public isEmpty(): boolean {
        const result = this.getNoComponents() === 0;
        MethodFailedException.assert(result === (this.getNoComponents() === 0), "isEmpty result must match component count");
        return result;
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // Narrow interface: abstract methods that subclasses must implement
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;
    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    // @methodtype command-method
    public concat(other: Name): void {
        const initialCount = this.getNoComponents();
        const otherDelimiter = other.getDelimiterCharacter();
        const needsMaskingAdjustment = this.delimiter !== otherDelimiter;

        for (let i = 0; i < other.getNoComponents(); i++) {
            let component = other.getComponent(i);
            if (needsMaskingAdjustment) {
                // Adjust masking to match the delimiter of this Name instance
                component = this.maskComponent(
                    this.unmaskComponent(component, otherDelimiter),
                    this.delimiter
                );
            }
            this.append(component);
        }

        MethodFailedException.assert(this.getNoComponents() === initialCount + other.getNoComponents(), "concat must add all components");
    }

    // @methodtype conversion-method
    protected unmaskComponent(c: string, delimiter: string): string {
        return c.replaceAll(ESCAPE_CHARACTER + delimiter, delimiter);
    }

    // @methodtype conversion-method
    protected maskComponent(c: string, delimiter: string): string {
        return c.replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);
    }

    // @methodtype assertion-method
    protected assertIsValidIndex(i: number): void {
        IllegalArgumentException.assert(i >= 0 && i < this.getNoComponents(), "index out of bounds");
    }

    // @methodtype assertion-method
    protected assertClassInvariants(): void {
        InvalidStateException.assert(this.delimiter !== undefined && this.delimiter !== null, "delimiter must not be null or undefined");
        InvalidStateException.assert(this.delimiter.length > 0, "delimiter must not be empty");
    }

}
