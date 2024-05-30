import { file, write, $ } from "bun";

import { resolve } from "node:path";
import { readdir, stat } from "node:fs/promises";

import chalk from "chalk";

const defaultIncludes = [
  "README.md",
  "LICENSE",
  "package.json",
  "tsconfig.json",
  ".gitignore",
];

const defaultExcludes = [
  ".git",
  ".DS_Store",
  "node_modules",
  ".vscode",
  ".backup",
  ".lockb",
  ".prettierrc",
  ".prettierignore",
];

const gitExcludes =
  file(".gitignore").size > 0 &&
  (await file(".gitignore")
    .text()
    .then((text) =>
      text
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "" && !line.trim().startsWith("#")),
    ));

gitExcludes && defaultExcludes.push(...gitExcludes);

export const mirrorDirectories = async (
  src: string,
  dest: string,
  excludes?: string[],
  sync = false,
) => {
  if (!src) console.error("Copy:source not provided");
  if (!dest) console.error("Copy:destination not provided");

  const [srcSet, destSet] = await Promise.all(
    [src, dest].map(async (element) => {
      const elements = await readdir(element, {
        withFileTypes: true,
        recursive: true,
      }).then((entries) => entries.map((entry) => entry.name));

      const excluded = !excludes
        ? defaultExcludes
        : [...new Set([...defaultExcludes, ...excludes])];

      const included = elements.filter(
        (file) => !excluded.some((exclusion) => file.includes(exclusion)),
      );

      const set = new Set(included);
      return set;
    }),
  );

  const synced = Array.from(srcSet).filter((file) => destSet.has(file));
  const unsynced = Array.from(srcSet).filter((file) => !destSet.has(file));
  const extraFiles = Array.from(destSet).filter((file) => !srcSet.has(file));

  let news = 0,
    updated = 0,
    deleted = 0;

  for (let entry of unsynced)
    try {
      await write(resolve(dest, entry), file(resolve(src, entry)));
      news++;
    } catch {
      // skip
    }

  for (let entry of synced) {
    const [srcStats, destStats] = await Promise.all(
      [src, dest].map(async (element) => {
        const size = file(resolve(element, entry)).size;
        const time = await stat(resolve(element, entry)).then(
          (stats) => stats.mtimeMs,
        );

        return { size, time };
      }),
    );

    const yesCopy = destStats.size === 0 || destStats.time < srcStats.time;

    if (!yesCopy) continue;

    try {
      await write(resolve(dest, entry), file(resolve(src, entry)));
      updated++;
    } catch {
      // skip
    }
  }

  if (!sync)
    for (let file of extraFiles) {
      try {
        await $`rm -rf ${resolve(dest, file)}`;
        deleted++;
      } catch {
        // skip
      }
    }

  const messages: string[] = [];

  news === 0 &&
    updated === 0 &&
    deleted === 0 &&
    messages.push(chalk.cyan("Everything is up to date!"));

  news > 0 &&
    messages.push(chalk.dim(`Copied ${news} new file${news > 1 ? "s" : ""}`));
  updated > 0 &&
    messages.push(
      chalk.yellow.dim(`Updated ${updated} file${updated > 1 ? "s" : ""}`),
    );
  deleted > 0 &&
    messages.push(
      chalk.red.dim(`Deleted ${deleted} extra file${deleted > 1 ? "s" : ""}`),
    );

  return messages;
};
