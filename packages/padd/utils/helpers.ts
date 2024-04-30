import { $, write, file } from "bun";

import { readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";

import chalk from "chalk";

import type { AppType, DocType } from "./types";

const __dirname = resolve(import.meta.dir, "../../..");
const __cwd = process.cwd();

export const copyDirectory = async (src: string, dest: string) => {
  !src && console.error("Copy:source not provided");
  !dest && console.error("Copy:destination not provided");

  await $`mkdir -p ${dest}`.quiet().nothrow();

  const entries = await readdir(src, {
    withFileTypes: true,
    recursive: true,
  }).then((entries) =>
    entries.filter((entry) => entry.isFile()).map((entry) => entry.name),
  );

  for (let entry of entries)
    await write(resolve(dest, entry), file(resolve(src, entry)));
};

export const paddDocs = async (path: string, pack: DocType) => {
  const { name, folder } = pack;

  const src = resolve(__dirname, "resources", "docs", folder);
  const dest = resolve(resolve(__cwd, path), "_extensions", name);

  await copyDirectory(src, dest);

  const message = chalk`Copied {green ${name}} to {dim ${dirname(path)}}`;

  return message;
};
