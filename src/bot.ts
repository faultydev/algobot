import {Client} from "discord.js";
import {ChildLogger} from "./lib/logger/ChildLogger";

let logger = new ChildLogger();

logger.debug("test");
process.exit(0)