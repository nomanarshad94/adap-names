import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected readonly name: string = "";
    protected readonly noComponents: number = 0;

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
    public setComponent(i: number, c: string): Name {
        const originalInstance = this.clone();
        this.assertIsValidIndex(i);
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const components = this.asComponentArray();
        const oldCount = this.getNoComponents();
        components[i] = c;
        const newName = new StringName(components.join(this.delimiter), this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === oldCount, "setComponent must not change component count");
        MethodFailedException.assert(newName.getComponent(i) === c, "setComponent must set correct component");
        InvalidStateException.assert(originalInstance.isEqual(this), "Immutability violated: original object changed");

        return newName;
    }

    // @methodtype command-method
    public insert(i: number, c: string): Name {
        const originalInstance = this.clone();
        IllegalArgumentException.assert(i >= 0 && i <= this.noComponents, "index out of bounds for insert");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.getNoComponents();
        const components = this.asComponentArray();
        components.splice(i, 0, c);
        const newName = new StringName(components.join(this.delimiter), this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === oldCount + 1, "insert must increase component count by 1");
        MethodFailedException.assert(newName.getComponent(i) === c, "insert must insert correct component");
        InvalidStateException.assert(originalInstance.isEqual(this), "Immutability violated: original object changed");

        return newName;
    }

    // @methodtype command-method
    public append(c: string): Name {
        const originalInstance = this.clone();
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.getNoComponents();
        let newNameString: string;
        if (this.isEmpty()) {
            newNameString = c;
        } else {
            newNameString = this.name + this.delimiter + c;
        }
        const newName = new StringName(newNameString, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === oldCount + 1, "append must increase component count by 1");
        MethodFailedException.assert(newName.getComponent(newName.getNoComponents() - 1) === c, "append must append correct component");
        InvalidStateException.assert(originalInstance.isEqual(this), "Immutability violated: original object changed");

        return newName;
    }

    // @methodtype command-method
    public remove(i: number): Name {
        const originalInstance = this.clone();
        this.assertIsValidIndex(i);

        const oldCount = this.getNoComponents();
        const components = this.asComponentArray();
        components.splice(i, 1);
        const newName = new StringName(components.join(this.delimiter), this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === oldCount - 1, "remove must decrease component count by 1");
        InvalidStateException.assert(originalInstance.isEqual(this), "Immutability violated: original object changed");

        return newName;
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
