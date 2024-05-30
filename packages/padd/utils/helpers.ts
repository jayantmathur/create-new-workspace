import { $, spawnSync, write, file } from "bun";

import { readdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";

import chalk from "chalk";

import type { AppType, DocType } from "./types";

const __dirname = resolve(import.meta.dir, "../../..");
const __cwd = process.cwd();

const deepMerge = (
  source: { [key: string]: any },
  target: { [key: string]: any },
): { [key: string]: any } => {
  let result = { ...source };

  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      if (Array.isArray(target[key]) && Array.isArray(result[key])) {
        result[key] = [...result[key], ...target[key]];
      } else if (
        typeof target[key] === "object" &&
        target[key] !== null &&
        typeof result[key] === "object" &&
        result[key] !== null
      ) {
        result[key] = deepMerge(result[key], target[key]);
      } else {
        result[key] = target[key];
      }
    }
  }

  return result;
};

const editJson = async (path: string, data: { [key: string]: any }) => {
  const details: JSON = await file(resolve(__cwd, path)).json();

  const payload = deepMerge(details, data);

  await write(resolve(path), JSON.stringify(payload, null, 2));

  return true;
};

export const copyDirectory = async (src: string, dest: string) => {
  !src && console.error("Copy:source not provided");
  !dest && console.error("Copy:destination not provided");

  await $`mkdir -p ${dest}`.quiet().nothrow();

  const entries = await readdir(src, {
    // withFileTypes: true,
    recursive: true,
  });

  for (let entry of entries)
    await write(resolve(dest, entry), file(resolve(src, entry)));
};

export const paddDocs = async (path: string, pack: DocType) => {
  const { name, folder } = pack;

  const src = resolve(__dirname, "resources", "docs", folder);
  const dest = resolve(resolve(__cwd, path), "_extensions", name);

  await copyDirectory(src, dest)
    .then(() => console.log(chalk.dim("Installed ") + chalk.bold.green(name)))
    .catch(() =>
      console.log(chalk.dim("Failed to install ") + chalk.bold.red(name)),
    );
};

export const paddApps = async (
  path: string,
  pack: AppType,
  withExtras = false,
) => {
  const {
    name,
    folder,
    dependencies,
    devDependencies,
    postinstalls,
    scripts,
    extras,
  } = pack;

  console.log("\nWorking on " + chalk.bold.green(name) + "...\n");

  if (folder) {
    const src = resolve(__dirname, "resources", "apps", folder);
    const dest = resolve(__cwd, path);

    await copyDirectory(src, dest)
      .then(() =>
        console.log(
          chalk.dim("Copied components from ") + chalk.bold.green(folder),
        ),
      )
      .catch(() =>
        console.log(chalk.dim("Failed to copy ") + chalk.bold.red(folder)),
      );
  }

  if (dependencies) {
    const packs = dependencies;

    withExtras && extras.dependencies && packs.push(...extras.dependencies);

    const { success } = spawnSync(["bun", "add", ...packs], {
      cwd: resolve(__cwd, path),
    });

    if (success) console.log(chalk.dim("Installed dependencies"));
    else console.warn("Failed to install some dependencies");
  }

  if (devDependencies) {
    const packs = devDependencies;

    withExtras &&
      extras.devDependencies &&
      packs.push(...extras.devDependencies);

    const { success } = spawnSync(["bun", "add", "--dev", ...packs], {
      cwd: resolve(__cwd, path),
    });

    if (success) console.log(chalk.dim("Installed devDependencies"));
    else console.warn("Failed to install some devDependencies");
  }

  if (postinstalls) {
    let successes = 0;
    for (let installation of postinstalls) {
      const commands = installation.split(" ");
      const { success } = spawnSync([...commands], {
        cwd: resolve(__cwd, path),
      });
      success && successes++;
    }

    if (successes === postinstalls.length)
      console.log(chalk.dim("Successfully ran all post installations"));
    else
      console.warn(
        `Successfully ran ${successes} out of ${postinstalls.length} post installations`,
      );
  }

  if (scripts) {
    const success =
      (await editJson(resolve(__cwd, path, "package.json"), {
        scripts,
      })) || false;
    if (success) console.log(chalk.dim("Added scripts"));
    else console.log(chalk.dim("Failed to add scripts"));
  }
};
