import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.parseComponents().length;
    }

    /**
     * Parses the internal string into components based on delimiter and escape characters
     */
    // @methodtype conversion-method
    private parseComponents(): string[] {
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
                    // Escape sequence - keep the escape and next character
                    currentComponent += ESCAPE_CHARACTER + this.name[i + 1];
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

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        const components = this.parseComponents();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        const components = this.parseComponents();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds.");
        }
        const components = this.parseComponents();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;
    }

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
    public remove(i: number): void {
        this.assertIsValidIndex(i);
        const components = this.parseComponents();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    // @methodtype assertion-method
    private assertIsValidIndex(i: number): void {
        if (i < 0 || i >= this.noComponents) {
            throw new Error("Index out of bounds.");
        }
    }

}
