import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        IllegalArgumentException.assert(cn !== undefined && cn !== null, "child node must not be null");
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== undefined && cn !== null, "child node must not be null");

        const oldSize = this.childNodes.size;
        this.childNodes.add(cn);

        MethodFailedException.assert(this.childNodes.has(cn), "child node must be added to set");
    }

    public removeChildNode(cn: Node): void {
        IllegalArgumentException.assert(cn !== undefined && cn !== null, "child node must not be null");

        this.childNodes.delete(cn); // Yikes! Should have been called remove

        MethodFailedException.assert(!this.childNodes.has(cn), "child node must be removed from set");
    }

}