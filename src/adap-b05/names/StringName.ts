import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source !== undefined && source !== null, "source must not be null or undefined");
        super(delimiter);
        this.name = source;
        this.noComponents = this.asComponentArray().length;
        this.assertClassInvariants();
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
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const components = this.asComponentArray();
        components[i] = c;
        this.name = components.join(this.delimiter);
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "index out of bounds for insert");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.noComponents;
        const components = this.asComponentArray();
        components.splice(i, 0, c);
        this.name = components.join(this.delimiter);
        this.noComponents++;

        MethodFailedException.assert(this.noComponents === oldCount + 1, "insert must increase component count by 1");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public append(c: string): void {
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.noComponents;
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;

        MethodFailedException.assert(this.noComponents === oldCount + 1, "append must increase component count by 1");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertIsValidIndex(i);

        const oldCount = this.noComponents;
        const components = this.asComponentArray();
        components.splice(i, 1);
        this.name = components.join(this.delimiter);
        this.noComponents--;

        MethodFailedException.assert(this.noComponents === oldCount - 1, "remove must decrease component count by 1");
        this.assertClassInvariants();
    }

    // @methodtype conversion-method
    private asComponentArray(): string[] {
        if (this.name === "") {
            return [];
        }
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
