import {LogLevel} from "./types";
import {BaseScriptCommunicationHandler} from "../scripts/BaseScriptCommunicationHandler";

export abstract class BaseLogger extends BaseScriptCommunicationHandler {
    abstract log(level: LogLevel, message: string): void;
    abstract debug(message: string): void;
    abstract info(message: string): void;
    abstract warn(message: string): void;
    abstract error(message: string): void;
    abstract fatal(message: string): void;
}