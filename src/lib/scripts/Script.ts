import {ChildProcess, fork} from "child_process";
import {amIChild} from "../../utils/procid";

export class Script {
    type: 'chore' | 'bot';
    childProcess: ChildProcess | null = null;
    path: string;
    result: string | null;

    constructor(path: string, type: 'chore' | 'bot') {
        this.path = path;
        if (this.path.endsWith(".ts")) this.path = this.path.slice(0, -3) + ".js"; // replace .ts with .js
        this.childProcess = null;
        this.result = null;
        this.type = type;
    }

    start() {
        this.childProcess = fork(this.path);
    }
}