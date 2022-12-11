import {Client, IntentsBitField} from "discord.js";
import {ChildLogger} from "./lib/logger/ChildLogger";
import {amIChild} from "./utils/procid";
import {readdir, readdirSync} from "fs";

if (!amIChild()) {
    throw new Error("This script can only be run in a child process");
}

let environ = (key: string) => {
    return new Promise((resolve, reject) => {
        process.on("message", (data: any) => {
            if (data.type === "env") {
                resolve(<string>data.content);
            }
            setTimeout(() => {
                reject(new Error("Timed out waiting for environment"));
            }, 5000);
        });
        process.send?.({
            type: "env",
            content: key
        });
    });
}

(async () => {
    let inhibitActivity = true;
    let logger = new ChildLogger();
    let client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
        ]
    });
    client.on("ready", () => {
        logger.info("Bot is logged in...");
        for (let file of readdirSync("./interactions")) {
            if (file.endsWith(".js")) {
                let interaction = require("./interactions/" + file);
                //
            }
        }
    });
    client.on("interactionCreate", async (interaction) => {
        if (inhibitActivity) {
            interaction.isRepliable() && interaction.reply("Activity is inhibited, please try again later...");
            return;
        }
    });
    client.login(<string>await environ("DISCORD_TOKEN")).catch((err) => {
        logger.error(err);
        process.exit(1);
    });

})();