import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source !== undefined && source !== null, "source must not be null or undefined");
        super(delimiter);
        this.components = [...source];
        this.assertClassInvariants();
    }

    // @methodtype get-method
    public getNoComponents(): number {
        return this.components.length;
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsValidIndex(i);
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.getNoComponents();
        this.components[i] = c;

        MethodFailedException.assert(this.getNoComponents() === oldCount, "setComponent must not change component count");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public insert(i: number, c: string): void {
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), "index out of bounds for insert");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.getNoComponents();
        this.components.splice(i, 0, c);

        MethodFailedException.assert(this.getNoComponents() === oldCount + 1, "insert must increase component count by 1");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public append(c: string): void {
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.getNoComponents();
        this.components.push(c);

        MethodFailedException.assert(this.getNoComponents() === oldCount + 1, "append must increase component count by 1");
        this.assertClassInvariants();
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertIsValidIndex(i);

        const oldCount = this.getNoComponents();
        this.components.splice(i, 1);

        MethodFailedException.assert(this.getNoComponents() === oldCount - 1, "remove must decrease component count by 1");
        this.assertClassInvariants();
    }
}
