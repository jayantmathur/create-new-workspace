import { argv } from "bun";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import type { Options } from "yargs";

export type CLIOptions = {
  exclude?: string[];
  sync?: boolean;
  tag?: "major" | "minor" | "patch";
};

export const options: Record<string, Options> = {
  e: {
    alias: "exclude",
    describe: "Additional exclusions during backup",
    type: "array",
    // demandOption: false,
  },
  s: {
    alias: "sync",
    describe: "Toggle sync mode",
    type: "boolean",
    default: false,
    // demandOption: false,
  },
  t: {
    alias: "tag",
    describe: "Version tag increment of the backup",
    choices: ["major", "minor", "patch"],
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
