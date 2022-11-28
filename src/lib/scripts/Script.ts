import {ChildProcess, fork} from "child_process";
import {amIChild} from "../../utils/procid";

export class Script {
    type: 'chore' | 'bot';
    childProcess: ChildProcess | null = null;
    path: string;

    constructor(path: string, type: 'chore' | 'bot') {
        this.path = path;
        if (this.path.endsWith(".ts")) this.path = this.path.slice(0, -3) + ".js"; // replace .ts with .js
        this.childProcess = null;
        this.type = type;
    }

    start() {
        this.childProcess = fork(this.path);
    }

    async blockUntilDone() {
        while (this.childProcess?.exitCode === null) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
}