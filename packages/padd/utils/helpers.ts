import { $, write, file } from "bun";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

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
