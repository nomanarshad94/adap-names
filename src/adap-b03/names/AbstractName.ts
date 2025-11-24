import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        if (delimiter === "") {
            throw new Error("Invalid delimiter: must not be empty string.");
        }
        this.delimiter = delimiter;
    }

    // @methodtype factory-method
    public clone(): Name {
        return Object.create(this);
    }

    /**
     * Returns a human-readable representation of the Name instance
     * Special characters are not escaped (creating a human-readable string)
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
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
        // Compare using asDataString for consistent comparison regardless of delimiter
        return this.asDataString() === other.asDataString();
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
        return this.getNoComponents() === 0;
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
    }

    /**
     * Removes escape characters to produce unmasked string
     */
    // @methodtype conversion-method
    protected unmaskComponent(c: string, delimiter: string): string {
        // First unescape delimiters, then unescape backslashes
        return c
            .replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }

    /**
     * Adds escape characters to mask special characters
     */
    // @methodtype conversion-method
    protected maskComponent(c: string, delimiter: string): string {
        // First escape backslashes, then escape delimiters
        return c
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);
    }

}
