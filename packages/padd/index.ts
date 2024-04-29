#!/usr/bin/env bun
import { resolve, dirname } from "node:path";

import chalk from "chalk";
import boxen from "boxen";

import cli from "./utils/cli";
import type { CLIOptions } from "./utils/cli";
import { copyDirectory } from "./utils/helpers";
import list from "./list.json";

type ListType = {
  [key: string]: {
    type: "app" | "doc";
    folder: string;
  };
};

const __dirname = resolve(import.meta.dir, "../..");
const __cwd = process.cwd();

const [docsPath, appsPath] = ["docs", "app"].map((dir) =>
  resolve(__dirname, "resources", dir),
);

const packages = list as ListType;

const { path, packs } = cli as unknown as CLIOptions;

const messages: string[] = [];

for (let pack of packs) {
  const current = pack.toLowerCase();

  if (!packages[current]) {
    console.error(`Pack not found: ${current}. Skipping...`);
    continue;
  }

  const { type, folder } = packages[current];

  const src = resolve(type === "doc" ? docsPath : appsPath, folder);
  const dest = resolve(
    resolve(__cwd, path),
    type === "doc" ? "_extensions" : "components",
    current,
  );

  await copyDirectory(src, dest);

  messages.push(
    chalk.dim("Copied"),
    chalk.bold.green(current),
    chalk.dim(`to ${dirname(path)}`),
  );
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
