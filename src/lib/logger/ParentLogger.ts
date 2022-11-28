import {BaseLogger} from "./BaseLogger";
import {LogLevel} from "./types";
import {basename} from "discord.js";

type Options = {
    outputPipe: NodeJS.WritableStream,
    template: string,
    line_terminator: string,
    level_padding: number,
};

export class ParentLogger extends BaseLogger {
    type: string = "log";
    outputPipe: NodeJS.WritableStream;
    options: Options;

    constructor(options: Options = {
                    outputPipe: process.stdout,
                    template: "[{level} | {date}] <{script}>: {message}",
                    level_padding: 5,
                    line_terminator: "\r\n"
                }
    ) {
        super();
        this.outputPipe = process.stdout;
        this.options = options;
    }

    private fmt(src: string, vars: { [key: string]: string }): string {
        for (let key in vars) {
            src = src.replace("{" + key + "}", vars[key]);
        }
        return src;
    }

    log(level: LogLevel, message: string, xvars: { [key: string]: string } = {}): void {
        let v = {
            level: level.padEnd(this.options.level_padding),
            date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
            message: message,
            script: basename(process.argv[1]),
            ...xvars
        };
        this.outputPipe.write(this.fmt(this.options.template, v) + this.options.line_terminator);
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

    error(message: string): void {
        this.log("error", message);
    }

    fatal(message: string): void {
        this.log("fatal", message);
    }

    handle(data: any) {
        this.log(data.level, data.message, {script: data.script});
    }

}