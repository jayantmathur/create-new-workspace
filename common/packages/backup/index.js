#!/usr/bin/env node

import path from "path";
import { existsSync, readdirSync } from "fs";
import fse from "fs-extra";
import { readFile, stat } from "fs/promises";
import { exec as syncExec } from "child_process";
import { promisify } from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
// import trash from "trash"; // `trash` should be installed globally as trash-cli
import chalk from "chalk";

const exec = promisify(syncExec);

const args = yargs(hideBin(process.argv))
  .option("src", {
    alias: "i",
    description: "Source folder",
    type: "string",
    default: ".\\",
  })
  .option("dest", {
    alias: "o",
    description: "Destination folder",
    type: "string",
    default: undefined,
  })
  .option("sync", {
    alias: "s",
    description: "Sync local copy with backup",
    type: "boolean",
    default: false,
  })
  .option("dev", {
    description: "Exclude dev repositories",
    type: "boolean",
    default: false,
  })
  .help()
  .alias("help", "h").argv;

const { src, dest, sync, dev } = args;

const localDest = `${process.cwd()}\\.backup`;

const source = path.basename(path.resolve(process.cwd(), src));

let destination = existsSync(localDest)
  ? await readFile(localDest, "utf-8")
  : dest;

const excludes = ["node_modules", ".git", ".next", "venv", ".backup"],
  includes = ["apps", "docs"],
  folderFilter = !dev
    ? [
        ...new Set([
          ...readdirSync(src).filter((folder) => !includes.includes(folder)),
          ...excludes,
        ]),
      ]
    : excludes;

// console.log(folderFilter);

const deleteFolder = async (path) => {
  const folder = path.split("\\").pop();

  await exec(`trash ${path}`).then(
    () => console.log(`Folder: ${folder} has been moved to the recycle bin`),
    async () => {
      console.log(`Error recycling: ${folder}. Deleting...`);
      await fse.remove(path).then(
        () => console.log(`Folder: ${folder} has been deleted`),
        () => console.log(`Error deleting: ${folder}. Folder intact`),
      );
    },
  );
};

const copyFolder = async (src, dest, sync = false) => {
  try {
    await fse.copy(src, dest, {
      overwrite: true,
      filter: async (srcPath, destPath) => {
        if (sync) {
          try {
            const srcStat = await stat(srcPath);
            const destStat = await stat(destPath);
            return srcStat.mtime > destStat.mtime; // only overwrite if source file is newer
          } catch (err) {
            return true; // if destination file doesn't exist, copy source file
          }
        }

        if (folderFilter.includes(path.basename(srcPath))) {
          // console.log(`Excluding: ${srcPath}`);
          return false;
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
  } else {
    destination = path.resolve(process.cwd(), destination) + "\\" + source;
  }

  if (sync) {
    if (!existsSync(destination)) {
      console.error(chalk.red("Destination path does not exist"));
      process.exit(1);
    }
    await copyFolder(destination, src, sync, dev);
  } else {
    await deleteFolder(destination);
    await copyFolder(src, destination, sync, dev);
  }

  console.log(
    !sync ? `Updating backup with source` : `Syncing local copy with backup`,
  );
};

await main();

console.log(chalk.green("Done"));
