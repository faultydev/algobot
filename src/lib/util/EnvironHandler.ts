import {BaseScriptCommunicationHandler} from "../scripts/BaseScriptCommunicationHandler";
import {Script} from "../scripts/Script";

export class EnvironHandler extends BaseScriptCommunicationHandler {
    type: string = "env";

    handle(data: any, source: Script): void {
        source.childProcess?.send({
            type: "env",
            content: process.env[data]
        })
    }

}