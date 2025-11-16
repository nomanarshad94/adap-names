import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;
        if (delimiter === "") {
            throw new Error("Invalid delimiter: must not be empty string.");
        }
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.noComponents = this.parseComponents().length;
    }

    /**
     * Parses the internal string into components based on delimiter and escape characters
     */
    // @methodtype conversion-method
    protected parseComponents(): string[] {
        if (this.name === "") {
            return [];
        }

        const components: string[] = [];
        let currentComponent = "";
        let i = 0;

        while (i < this.name.length) {
            const char = this.name[i];

            if (char === ESCAPE_CHARACTER) {
                if (i + 1 < this.name.length) {
                    // Escape sequence - add the next character literally
                    currentComponent += this.name[i + 1];
                    i += 2;
                } else {
                    // Trailing escape character with nothing to escape
                    throw new Error("Invalid escape sequence: trailing escape character");
                }
            } else if (char === this.delimiter) {
                // Found unescaped delimiter - finish current component
                components.push(currentComponent);
                currentComponent = "";
                i++;
            } else {
                // Regular character
                currentComponent += char;
                i++;
            }
        }

        // Add the last component
        components.push(currentComponent);

        return components;
    }


    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        return this.parseComponents()
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
            return this.name;
        } else {
            // Needs masking adjustment to match the default delimiter
            return this.parseComponents()
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
        return this.noComponents === 0;
    }

    /** Returns number of components in Name instance */
    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    /** Returns properly masked component string */
    // @methodtype get-method
    public getComponent(x: number): string {
        this.assertIsValidIndex(x);
        const components = this.parseComponents();
        return components[x];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(n: number, c: string): void {
        this.assertIsValidIndex(n);
        const components = this.parseComponents();
        components[n] = c;
        this.name = components.join(this.delimiter);
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(n: number, c: string): void {
        if (n < 0 || n > this.noComponents) {
            throw new Error("Index out of bounds.");
        }
        const components = this.parseComponents();
        components.splice(n, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    // @methodtype command-method
    public remove(n: number): void {
        this.assertIsValidIndex(n);
        const components = this.parseComponents();
        components.splice(n, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
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
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds.");
        }
    }

}