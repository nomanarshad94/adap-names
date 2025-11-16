import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(source: string[], delimiter?: string) {
        this.components = [...source];
        if (delimiter === "") {
            throw new Error("Invalid delimiter: must not be empty string.");
        }
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        return this.components
            .map(c => this.unmaskComponent(c, this.delimiter))
            .join(delimiter);
    }

    /**
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        if (this.delimiter === DEFAULT_DELIMITER) {
            return this.components.join(DEFAULT_DELIMITER);
        } else {
            // Needs masking adjustment to match the default delimiter
            return this.components
                .map(c => this.maskComponent(
                    this.unmaskComponent(c, this.delimiter),
                    DEFAULT_DELIMITER))
                .join(DEFAULT_DELIMITER);
        }
    }

    // @methodtype get-method
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    // @methodtype boolean-query-method
    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    /** Returns number of components in Name instance */
    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Returns properly masked component string */
    // @methodtype get-method
    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        this.components[i] = c;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Index out of bounds.");
        }
        if (i === this.components.length) {
            this.append(c);
        } else {
            this.components.splice(i, 0, c);
        }
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertIsValidIndex(i);
        this.components.splice(i, 1);
    }

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

    // @methodtype conversion-method
    private unmaskComponent(c: string, delimiter: string): string {
        // First unescape delimiters, then unescape backslashes
        return c
            .replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }

    // @methodtype conversion-method
    private maskComponent(c: string, delimiter: string): string {
        // First escape backslashes, then escape delimiters
        return c
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(delimiter, ESCAPE_CHARACTER + delimiter);
    }

    // @methodtype assertion-method
    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Index out of bounds.");
        }
    }

}