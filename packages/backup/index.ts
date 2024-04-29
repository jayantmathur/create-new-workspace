#!/usr/bin/env bun
import { file, spawnSync, $ } from "bun";
import { resolve, basename } from "node:path";
import { exists } from "node:fs/promises";

import chalk from "chalk";
import boxen from "boxen";

import cli from "./utils/cli";
import type { CLIOptions } from "./utils/cli";
import { mirrorDirectories } from "./utils/helpers";

const {
  include: includes,
  exclude: excludes,
  sync = false,
  tag,
} = cli as unknown as CLIOptions;

const src = process.cwd();
const repo = basename(src);
const backupPath = resolve(src, ".backup");

if (file(backupPath).size === 0) {
  console.error("Backup:source not provided");
  process.exit(1);
}

const dest = await file(backupPath).text();

if (sync) {
  const syncExists = await exists(resolve(dest, repo));
  if (!syncExists) {
    console.error("Sync:source not available. Backup first!");
    process.exit(1);
  }
} else {
  const destExists = await exists(dest);
  if (!destExists) {
    console.error("Backup:destination not valid");
    process.exit(1);
  }

  await $`mkdir -p ${resolve(dest, repo)}`.nothrow();
}

await $`which git`.quiet().then(
  async () =>
    await exists(resolve(src, ".git")).then(() => {
      spawnSync(["git", "add", "."]);
      spawnSync([
        "git",
        "commit",
        "--all",
        "--message",
        (tag && `${tag} update`) || "quick save",
      ]);
    }),
);

tag && (await $`npm version ${tag} --silent`);

const [to, from] = sync
  ? [resolve(dest, repo), src]
  : [src, resolve(dest, repo)];

const messages: void | string[] = await mirrorDirectories(
  to,
  from,
  includes,
  excludes,
  sync,
);

console.log(
  chalk.bold.yellow("\n" + (sync ? "Syncing" : "Backing up")),
  "\n",
  basename(src),
  chalk.bold.yellow(sync ? "from" : "to"),
  basename(dest),
  "\n",
);

console.log(
  boxen(messages.join("\n"), {
    title: "Results",
    titleAlignment: "left",
    padding: 0.5,
    // borderStyle: "round",
  }),
);

await $`which git`
  .quiet()
  .then(
    async () =>
      await exists(resolve(src, ".git")).then(() =>
        spawnSync(["git", "push", "--quiet"]),
      ),
  );

process.exit(0);
