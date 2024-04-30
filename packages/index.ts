#!/usr/bin/env bun
import { argv, spawnSync, sleep } from "bun";

import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { clear as clearConsole } from "console";

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import chalk from "chalk";
import boxen from "boxen";

const __dirname = import.meta.dir;
const packages = await readdir(__dirname, { withFileTypes: true }).then(
  (elements) =>
    elements
      .filter((element) => element.isDirectory())
      .map((element) => element.name),
);

const instance = yargs(hideBin(argv));

const cli = instance
  .wrap(instance.terminalWidth())
  .scriptName("cnwx")
  .usage(
    boxen(
      `
        ${chalk.bold.inverse("cnwx <command> (...args)")}

        Execute a package command from the create-new-workspace repository. 
        
        (options) 
        ${chalk.green(packages.join(", "))}
      `,
      { padding: 0.5, title: "Usage", titleAlignment: "left" },
    ),
  )
  .command("$0 <command>", "Package command to execute")
  .help("h")
  .alias("h", "help")
  .alias("v", "version")
  .parse();

const { command } = cli as unknown as {
  command: string;
};

const flags = argv.slice(3);

clearConsole();

console.log(`Running: bun ${command} ${flags.join(" ")}`);

await sleep(2000);

const script = resolve(__dirname, command, "index.ts");

spawnSync(["bun", script, ...flags], {
  stderr: "inherit",
  stdout: "inherit",
});

process.exit(0);
