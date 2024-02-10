#!/usr/bin/env node

import packages from "./list.json" assert { type: "json" };
import { readFile, writeFile } from "fs/promises";
import { existsSync } from "fs";
import fse from "fs-extra";
import { basename, dirname } from "path";
import { fileURLToPath } from "url";
import { exec as syncExec } from "child_process";
import { promisify } from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import lodash from "lodash";
const { merge } = lodash;

const __dirname = dirname(fileURLToPath(import.meta.url));

const exec = promisify(syncExec);

const spinner = createSpinner();

const sleep = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const appendJson = async (path = "", data = {}) => {
  const content = await readFile(path, "utf8");
  const merged = merge({}, JSON.parse(content), data);
  await writeFile(path, JSON.stringify(merged, null, 2), "utf8");
};

const copyFolder = async (src = "", dest = "") => {
  const excludeFolders = ["node_modules", ".git", "venv", ".backup"]; // add the folders you want to exclude

  try {
    fse.copy(src, dest, {
      overwrite: true,
      filter: (srcPath) => !excludeFolders.includes(basename(srcPath)),
    });
  } catch (err) {
    console.error(err);
  }
};

const args = yargs(hideBin(process.argv))
  .option("path", {
    alias: "i",
    description: "Path to the project",
    type: "string",
    default: ".",
  })
  .option("packs", {
    alias: "p",
    description: "Pack(s) to install",
    type: "array",
    default: [],
  })
  .help()
  .alias("help", "h").argv;

const { path, packs } = args;

process.stdout.write("\x1Bc");

if (!existsSync(path)) {
  console.log(chalk.red("Path does not exist. Exiting..."));
  process.exit(0);
}

if (packs.length < 1) {
  console.log(chalk.red("No pack(s) provided. Exiting..."));
  process.exit(0);
}

process.chdir(path);

console.log(chalk.grey(`Path: ${path}\n`));
console.log(chalk.grey(`List of pack(s): ${packs}\n`));

for (const pack of packs) {
  console.log(`Installing ${pack}`);

  const {
    dependencies = [],
    devDependencies = [],
    scripts = {},
    resources = [],
    postinstalls = [],
  } = packages[pack];

  if (dependencies?.length > 0) {
    spinner.start({ text: `Installing dependencies...` });

    await exec(`pnpm add ${dependencies.join(" ")}`).then(
      () =>
        spinner.success({
          text: chalk.greenBright(`Added ${pack} dependencies`),
        }),
      () =>
        spinner.error({
          text: chalk.redBright(`Failed to add ${pack} dependencies`),
        }),
    );

    await sleep();
  }

  if (devDependencies?.length > 0) {
    spinner.start({ text: `Installing devDependencies...` });

    await exec(`pnpm add -D ${devDependencies.join(" ")}`).then(
      () =>
        spinner.success({
          text: chalk.greenBright(`Added ${pack} devDependencies`),
        }),
      () =>
        spinner.error({
          text: chalk.redBright(`Failed to add ${pack} devDependencies`),
        }),
    );

    await sleep();
  }

  if (Object.keys(scripts).length > 0) {
    spinner.start({ text: `Adding scripts...` });

    await appendJson("package.json", { scripts: scripts }).then(
      () =>
        spinner.success({
          text: chalk.greenBright(`Added ${pack} scripts`),
        }),
      () =>
        spinner.error({
          text: chalk.redBright(`Failed to add ${pack} scripts`),
        }),
    );

    await sleep();
  }

  if (resources?.length > 0) {
    spinner.start({ text: `Adding resources...` });

    resources.forEach(async (resource) => {
      await copyFolder(
        `${__dirname}\\resources\\${resource.src}`,
        `${resource.dest || "."}`,
      ).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`Added ${pack} resources`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`Failed to add ${pack} resources`),
          }),
      );
    });

    await sleep();
  }

  if (postinstalls?.length > 0) {
    spinner.start({ text: `Running post installs...` });

    const promises = postinstalls.map(async (postinstall) => {
      await exec(postinstall).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`Ran ${pack} post installs`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`Failed to run ${pack} post installs`),
          }),
      );
    });

    await Promise.all(promises);

    await sleep();
  }

  console.log(chalk.grey(`Finished install attempt for ${pack} pack`));
}

console.log("\nDone\n");

process.exit(0);
