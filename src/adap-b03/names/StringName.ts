import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.asComponentArray().length;
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.noComponents;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        return components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        const components = this.asComponentArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.noComponents) {
            throw new Error("Index out of bounds.");
        }
        const components = this.asComponentArray();
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
        const components = this.asComponentArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;
    }

    // @methodtype conversion-method
    private asComponentArray(): string[] {
        const escapedDelimiter = this.escapeRegexInput(this.delimiter);
        const escapedEscapeCharacter = this.escapeRegexInput(ESCAPE_CHARACTER);
        const regex = new RegExp(`(?<!${escapedEscapeCharacter})${escapedDelimiter}`, 'g');
        return this.name.split(regex);
    }

    // @methodtype helper-method
    private escapeRegexInput(input: string): string {
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}
