import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected readonly components: string[] = [];

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

    // @methodtype factory-method
    public clone(): Name {
        return new StringArrayName([...this.components], this.delimiter);
    }

    // @methodtype get-method
    public getComponent(i: number): string {
        this.assertIsValidIndex(i);
        return this.components[i];
    }

    // @methodtype set-method
    public setComponent(i: number, c: string): Name {
        const originalInstance = this.clone();
        this.assertIsValidIndex(i);
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.getNoComponents();
        const newComponents = [...this.components];
        newComponents[i] = c;
        const newName = new StringArrayName(newComponents, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === oldCount, "setComponent must not change component count");
        MethodFailedException.assert(newName.getComponent(i) === c, "setComponent must set correct component");
        InvalidStateException.assert(originalInstance.isEqual(this), "Immutability violated: original object changed");

        return newName;
    }

    // @methodtype command-method
    public insert(i: number, c: string): Name {
        const originalInstance = this.clone();
        IllegalArgumentException.assert(i >= 0 && i <= this.getNoComponents(), "index out of bounds for insert");
        IllegalArgumentException.assert(c !== undefined && c !== null, "component must not be null or undefined");

        const oldCount = this.getNoComponents();
        const newComponents = [...this.components];
        newComponents.splice(i, 0, c);
        const newName = new StringArrayName(newComponents, this.delimiter);

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
        const newComponents = [...this.components, c];
        const newName = new StringArrayName(newComponents, this.delimiter);

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
        const newComponents = [...this.components];
        newComponents.splice(i, 1);
        const newName = new StringArrayName(newComponents, this.delimiter);

        MethodFailedException.assert(newName.getNoComponents() === oldCount - 1, "remove must decrease component count by 1");
        InvalidStateException.assert(originalInstance.isEqual(this), "Immutability violated: original object changed");

        return newName;
    }
}
