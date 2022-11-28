import {ParentLogger} from "./logger/ParentLogger";
import {Script} from "./scripts/Script";
import {ScriptCommunicationRouter} from "./scripts/ScriptCommunicationRouter";
import {BaseScriptCommunicationHandler} from "./scripts/BaseScriptCommunicationHandler";

export class MainWrapper {
    private static _instance: MainWrapper;
    private _logger: ParentLogger;
    private _scr: ScriptCommunicationRouter;
    private _scripts: Script[];

    constructor() {
        this._logger = new ParentLogger();
        this._scr = new ScriptCommunicationRouter();
        this._scripts = [];
    }

    static get instance(): MainWrapper {
        if (!MainWrapper._instance) {
            MainWrapper._instance = new MainWrapper();
        }
        return MainWrapper._instance;
    }

    get logger(): ParentLogger {
        return this._logger;
    }

    get scripts(): Script[] {
        return this._scripts;
    }

    start() {
        this._logger.info("Starting MainWrapper...");

        this._logger.debug("Adding ScriptCommunicationHandler; ParentLogger...");
        this._scr.addHandler(this._logger);
        this._logger.debug("Adding Custom ScriptCommunicationHandler; BotKeepAlive...");
        //todo

        this._logger.debug("Adding scripts...");
        [
            new Script("bot.ts", "bot"),
        ].forEach((s) => {
            this._scripts.push(s);
        });
        this._logger.debug("Starting scripts...");
        this._scripts.forEach((script) => {
            this._logger.debug("Starting script " + script.path);
            script.start();
            if (script.type === "bot") {
                let restart = (code: number, signal: any) => {
                    if (code === 0) {
                        this._logger.info("Script " + script.path + " exited with code 0; not restarting.");
                        return;
                    }
                    this._logger.debug("Script " + script.path + " exited with code " + code + "; restarting...");
                    script.start();
                    script.childProcess?.on("exit", restart);
                }
                script.childProcess?.on("exit", restart);
            }
            this._scr.handleScript(script);
        });
        this._logger.info("MainWrapper started.");
    }
}
