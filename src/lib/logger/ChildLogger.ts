import {amIChild} from "../../utils/procid";
import {BaseLogger} from "./BaseLogger";
import {LogLevel} from "./types";
import {basename} from "discord.js";

export class ChildLogger extends BaseLogger {
    type: string = "log";
    constructor() {
        super();
        if (!amIChild()) {
            throw new Error("ChildLogger can only be used in child processes");
        }
    }

    log(level: LogLevel, message: string, script: string | undefined = undefined): void {
        // @ts-ignore
        // justification: process.send is only available in child processes and is checked in the constructor
        process.send({
            type: "log",
            content: {
                level: level,
                message: message,
                script: script || basename(process.argv[1])
            }
        });
    }

    debug(message: string): void {
        this.log("debug", message);
    }

    info(message: string): void {
        this.log("info", message);
    }

    warn(message: string): void {
        this.log("warn", message);
    }

    error(message: string) {
        this.log("error", message);
    }

    fatal(message: string): void {
        this.log("fatal", message);
    }

    handle(data: any) {
        this.log(data.level, data.message, data.script);
    }
}

