#!/usr/bin/env node

import path from "path";
import { existsSync, readdirSync } from "fs";
import fse from "fs-extra";
import { readFile, stat } from "fs/promises";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import trash from "trash";
import chalk from "chalk";

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
  .option("noDev", {
    description: "Exclude dev repositories",
    type: "boolean",
    default: false,
  })
  .help()
  .alias("help", "h").argv;

const { src, dest, sync, noDev } = args;

const localDest = `${process.cwd()}\\.backup`;

const source = path.basename(path.resolve(process.cwd(), src));

let destination = existsSync(localDest)
  ? await readFile(localDest, "utf-8")
  : dest;

const excludeFolders = noDev
  ? readdirSync(src).filter((folder) => !["apps", "docs"].includes(folder))
  : ["node_modules", ".git", ".next", "venv", ".backup"];

const deleteFolder = async (path) => {
  const folder = path.split("\\").pop();

  try {
    await trash(path);
    console.log(`Folder ${folder} has been moved to the recycle bin`);
  } catch (err) {
    console.error(err);
  }
};

const copyFolder = async (src, dest, sync = false, dev = false) => {
  try {
    await fse.copy(src, dest, {
      overwrite: true,
      filter: async (srcPath, destPath) => {
        if (excludeFolders.includes(path.basename(srcPath))) {
          return false;
        }

        if (sync) {
          try {
            const srcStat = await stat(srcPath);
            const destStat = await stat(destPath);
            return srcStat.mtime > destStat.mtime; // only overwrite if source file is newer
          } catch (err) {
            return true; // if destination file doesn't exist, copy source file
          }
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
    await copyFolder(destination, src, sync, noDev);
  } else {
    await deleteFolder(destination);
    await copyFolder(src, destination, sync, noDev);
  }

  console.log(
    !sync ? `Updating backup with source` : `Syncing local copy with backup`,
  );
};

await main();

console.log(chalk.green("Done"));
