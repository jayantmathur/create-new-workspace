#!/usr/bin/env node

import path from "path";
import { existsSync } from "fs";
import fse from "fs-extra";
import { readFile, stat } from "fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import trash from "trash";
import chalk from "chalk";

const args = yargs(hideBin(process.argv)).argv;

const excludeFolders = ["node_modules", ".git", "venv", ".backup"]; // add the folders you want to exclude

const { src = ".\\", dest = undefined, sync = false } = args;

const localDest = `${process.cwd()}\\.backup`;

const source = path.basename(path.resolve(process.cwd(), src));

const destination =
  path.resolve(
    process.cwd(),
    (existsSync(localDest) && (await readFile(localDest, "utf-8"))) || dest,
  ) +
  "\\" +
  source;

const deleteFolder = async (path = "") => {
  const folder = path.split("\\").pop();

  try {
    await trash(path);
    console.log(`Folder ${folder} has been moved to the recycle bin`);
  } catch (err) {
    console.error(err);
  }
};

const copyFolder = async (src = "..\\", dest = "", sync = false) => {
  try {
    fse.copy(src, dest, {
      overwrite: true,
      filter: async (srcPath, destPath) => {
        if (excludeFolders.includes(path.basename(srcPath))) {
          return false;
        }

        if (sync)
          try {
            const srcStat = await stat(srcPath);
            const destStat = await stat(destPath);
            return srcStat.mtime > destStat.mtime; // only overwrite if source file is newer
          } catch (err) {
            return true; // if destination file doesn't exist, copy source file
          }

        return true;
      },
    });
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {
  if (!destination) {
    console.error(chalk.red("Destination path (absolute) is required"));
    process.exit(1);
  }

  existsSync(destination) && (await deleteFolder(destination));
  await copyFolder(src, destination);
};

const syncLocal = async () => {
  await copyFolder(destination, src, true);
};

if (sync) {
  await syncLocal();

  console.log(`Syncing local copy with backup`);
} else {
  await main();
  console.log(`Updating backup with source`);
}

console.log(chalk.green("Done"));
