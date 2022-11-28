import {ChildLogger} from "../../lib/logger/ChildLogger";

let logger = new ChildLogger();

logger.info("test");
setTimeout(() => {
    logger.info("test");
    process.exit(0);
}, 1000);