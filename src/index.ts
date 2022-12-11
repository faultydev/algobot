import {MainWrapper} from "./lib/MainWrapper";
import {config} from "dotenv";
config({ path: '../.env' });

// start the main wrapper
MainWrapper.instance.start();