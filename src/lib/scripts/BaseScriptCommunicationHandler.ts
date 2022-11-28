import {Script} from "./Script";

export abstract class BaseScriptCommunicationHandler {
    abstract type: string;
    abstract handle(data: any, source: Script): void;
}