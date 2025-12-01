import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.doGetFileState() === FileState.CLOSED, "file must be closed before it can be opened");

        this.state = FileState.OPEN;

        MethodFailedException.assert(this.doGetFileState() === FileState.OPEN, "file must be in open state after opening");
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(noBytes >= 0, "number of bytes must not be negative");
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN, "file must be open before reading");

        // read something
        return new Int8Array();
    }

    public close(): void {
        IllegalArgumentException.assert(this.doGetFileState() === FileState.OPEN, "file must be open before it can be closed");

        this.state = FileState.CLOSED;

        MethodFailedException.assert(this.doGetFileState() === FileState.CLOSED, "file must be in closed state after closing");
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}