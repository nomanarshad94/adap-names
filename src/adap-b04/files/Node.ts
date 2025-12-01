import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        IllegalArgumentException.assert(bn !== undefined && bn !== null && bn.length > 0, "base name must not be empty");
        IllegalArgumentException.assert(pn !== undefined && pn !== null, "parent node must not be null");

        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
        this.assertClassInvariants();
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        IllegalArgumentException.assert(to !== undefined && to !== null, "target directory must not be null");

        const oldParent = this.parentNode;
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;

        MethodFailedException.assert(this.parentNode === to, "move must update parent node");
        this.assertClassInvariants();
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        IllegalArgumentException.assert(bn !== undefined && bn !== null && bn.length > 0, "base name must not be empty");
        this.doSetBaseName(bn);
        this.assertClassInvariants();
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    protected assertClassInvariants(): void {
        InvalidStateException.assert(this.baseName !== undefined && this.baseName !== null, "base name must not be null");
        InvalidStateException.assert(this.baseName.length > 0, "base name must not be empty");
        InvalidStateException.assert(this.parentNode !== undefined && this.parentNode !== null, "parent node must not be null");
    }

}
