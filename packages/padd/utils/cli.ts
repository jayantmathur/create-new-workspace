import { argv } from "bun";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import type { Options } from "yargs";

export const options: Record<string, Options> = {
  i: {
    alias: "path",
    describe: "Path to padd",
    type: "string",
    default: "./",
  },
  p: {
    alias: "packs",
    describe: "List of packs to add",
    type: "array",
    demandOption: true,
  },
  e: {
    alias: "extras",
    describe: "Include extra files",
    type: "boolean",
    default: false,
  },
};

const instance = yargs(hideBin(argv));

const cli = instance
  .wrap(instance.terminalWidth())
  .options(options)
  .help("h")
  .alias("h", "help")
  .alias("v", "version")
  .parse();

export default cli;
