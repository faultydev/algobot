import {BaseScriptCommunicationHandler} from "./BaseScriptCommunicationHandler";
import {Script} from "./Script";

export class ScriptCommunicationRouter {
    private handlers: Map<string, BaseScriptCommunicationHandler>;

    constructor() {
        this.handlers = new Map<string, BaseScriptCommunicationHandler>();
    }

    addHandler(handler: BaseScriptCommunicationHandler) {
        this.handlers.set(handler.type, handler);
    }

    handle(data: any, source: Script) {
        let handler = this.handlers.get(data.type);
        if (handler) {
            handler.handle(data.content, source);
        } else {
            throw new Error("No handler found for " + data.type);
        }
    }

    handleScript(child: Script) {
        child.childProcess?.on("message", (data: any) => {
            this.handle(data, child);
        });

    }
}