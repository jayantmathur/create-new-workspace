#!/usr/bin/env bun
import { resolve, dirname } from "node:path";

import chalk from "chalk";
import boxen from "boxen";

import cli from "./utils/cli";
import type { CLIOptions } from "./utils/cli";
import { copyDirectory, paddDocs } from "./utils/helpers";
import list from "./list.json";

import type { ListType, DocType, AppType } from "./utils/types";

const packages = list as ListType;

const { path, packs } = cli as unknown as CLIOptions;

const messages: string[] = [];

for (let pack of packs) {
  const current = {
    ...packages[pack.toLowerCase()],
    name: pack.toLowerCase(),
  };

  if (!current) {
    console.error(`Pack not found: ${current}. Skipping...`);
    continue;
  }

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
