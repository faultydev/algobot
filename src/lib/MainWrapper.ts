import {ParentLogger} from "./logger/ParentLogger";
import {Script} from "./scripts/Script";
import {ScriptCommunicationRouter} from "./scripts/ScriptCommunicationRouter";
import {BaseScriptCommunicationHandler} from "./scripts/BaseScriptCommunicationHandler";
import {readdir} from "fs/promises";
import {EnvironHandler} from "./util/EnvironHandler";
import {SnowflakeFactory} from "./util/SnowflakeFactory";

export class MainWrapper {
    private static _instance: MainWrapper;
    private _scr: ScriptCommunicationRouter;
    private _scripts: Script[];
    private _logger: ParentLogger;
    private _snowflakeFactory: SnowflakeFactory;

    constructor() {
        this._logger = new ParentLogger();
        this._scr = new ScriptCommunicationRouter();
        this._snowflakeFactory = new SnowflakeFactory(0);
        this._scripts = ["bot.ts"].map((file) => new Script(file, 'bot'));
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

    get snowflakeFactory(): SnowflakeFactory {
        return this._snowflakeFactory;
    }

    private async blockingChores(type: 'pre-run' | 'post-run') {
        this._logger.info("Running " + type + " chores...");
        let files = await readdir("chores/" + type);
        for (let file of files) {
            let script = new Script("chores/" + type + "/" + file, 'chore');
            await script.start();
            this._scr.handleScript(script);
            await script.blockUntilDone();
        }
    }

    private async main() {
        this._logger.info("Starting main...");
        for (let script of this._scripts) {
            await script.start();
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
            await script.blockUntilDone();
        }
    }

    async start() {
        this._logger.info("Starting MainWrapper...");

        this._logger.debug("Adding ScriptCommunicationHandler; ParentLogger...");
        this._scr.addHandler(this._logger);
        this._scr.addHandler(new EnvironHandler());

        await this.blockingChores('pre-run');
        this.main()
            .then(r => {
                this._logger.info("MainWrapper finished.");
            });

        this._logger.info("MainWrapper started.");
    }
}
