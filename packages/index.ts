#!/usr/bin/env bun
import { argv, spawnSync } from "bun";

import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

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
  .usage(
    boxen(
      `
        ${chalk.bold.inverse("cnwx <command> [args...]")}

        Execute a package command from the create-new-workspace repository. 
        
        (options) 
        ${chalk.green(packages.join(", "))}
      `,
      { padding: 0.5, title: "Usage", titleAlignment: "left" },
    ),
  )
  .command("$0 <command> [args...]", "Package command to execute", (yargs) => {
    yargs.positional("command", {
      describe: "The command to execute",
      type: "string",
      demandOption: true,
    });
  })
  .help("h")
  .alias("h", "help")
  .alias("v", "version")
  .parse();

const { command, ...args } = cli as unknown as {
  command: string;
  [key: string]: string | boolean | string[];
};

["_", "$0", "args"].forEach((key) => delete args[key]);

const flags: string[] = [];

Object.keys(args).forEach((key) => {
  flags.push(`--${key}`);

  const value = args[key];

  if (Array.isArray(value)) flags.push(value.join(" "));
  else if (typeof value === "boolean") flags.push(`--${key}`);
  else flags.push(value);
});

const script = resolve(__dirname, command, "index.ts");

spawnSync(["bun", script, ...flags], {
  stderr: "inherit",
  stdout: "inherit",
});

process.exit(0);
