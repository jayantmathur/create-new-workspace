#!/usr/bin/env bun
import chalk from "chalk";
import boxen from "boxen";

import cli from "./utils/cli";
import { paddDocs, paddApps } from "./utils/helpers";
import list from "./list.json";

import type { CLIOptions, ListType, DocType, AppType } from "./utils/types";

const packages = list as ListType;
const { path, packs, extras } = cli as unknown as CLIOptions;
const messages: string[] = [];

for (let pack of packs) {
  const name = pack.toLowerCase();
  const current = packages[name];

  if (!current) {
    messages.push(chalk.red(`Not found: ${name}. Skipping...`));
    continue;
  }

  Object.assign(current, { name });

  current.type === "doc" &&
    (await paddDocs(path, current as DocType).then((message) =>
      messages.push(message),
    ));

  current.type === "app" &&
    (await paddApps(path, current as AppType, extras).then((message) =>
      messages.push(message),
    ));
}

console.log(
  boxen(messages.join("\n"), {
    title: "Results",
    titleAlignment: "left",
    padding: 0.5,
    // borderStyle: "round",
  }),
);

process.exit(0);
