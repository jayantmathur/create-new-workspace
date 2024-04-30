#!/usr/bin/env bun
import chalk from "chalk";
import boxen from "boxen";

import cli from "./utils/cli";
import type { CLIOptions } from "./utils/cli";
import { paddDocs } from "./utils/helpers";
import list from "./list.json";

import type { ListType, DocType, AppType } from "./utils/types";

const packages = list as ListType;

const { path, packs } = cli as unknown as CLIOptions;

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
}

console.log(
  boxen(messages.join(" "), {
    title: "Results",
    titleAlignment: "left",
    padding: 0.5,
    // borderStyle: "round",
  }),
);

process.exit(0);
