#!/usr/bin/env node

import packages from "./list.json" assert { type: "json" };
import { readFile, writeFile } from "fs/promises";
import fse from "fs-extra";
import { basename } from "path";
import { exec as syncExec } from "child_process";
import { promisify } from "util";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import lodash from "lodash";
const { merge } = lodash;

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
  .option("packs", {
    alias: "p",
    description: "Pack(s) to install",
    type: "array",
    default: [],
  })
  .help()
  .alias("help", "h").argv;

const { packs } = args;

const main = async () => {
  if (packs.length < 0) {
    console.error(chalk.red("No pack(s) provided. Exiting..."));
    process.exit(1);
  }

  console.log(chalk.grey(`List of pack(s): ${packs}\n`));

  packs.forEach(async (pack) => {
    console.log(`\nInstalling ${pack}\n`);

    const { dependencies, devDependencies, scripts, resources, postinstalls } =
      packages[pack];

    if (dependencies?.length < 0) return;
    else {
      spinner.start(`\nInstalling dependencies...\n`);

      await exec(`pnpm add ${dependencies.join(" ")}`).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`\nAdded ${pack} dependencies\n`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`\nFailed to add ${pack} dependencies\n`),
          }),
      );

      await sleep();
    }

    if (devDependencies?.length < 0) return;
    else {
      spinner.start(`\nInstalling devDependencies...\n`);

      await exec(`pnpm add -D ${devDependencies.join(" ")}`).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`\nAdded ${pack} devDependencies\n`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`\nFailed to add ${pack} devDependencies\n`),
          }),
      );

      await sleep();
    }

    if (scripts?.length < 0) return;
    else {
      spinner.start(`\nAdding scripts...\n`);

      await appendJson("package.json", { scripts }).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`\nAdded ${pack} scripts\n`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`\nFailed to add ${pack} scripts\n`),
          }),
      );

      await sleep();
    }

    if (resources?.length < 0) return;
    else {
      spinner.start(`\nAdding resources...\n`);

      resources.forEach(async (resource) => {
        await copyFolder(
          `./resources/${resource.src}`,
          `${resource.dest || "./"}`,
        ).then(
          () =>
            spinner.success({
              text: chalk.greenBright(`\nAdded ${pack} resources\n`),
            }),
          () =>
            spinner.error({
              text: chalk.redBright(`\nFailed to add ${pack} resources\n`),
            }),
        );
      });

      await sleep();
    }

    if (postinstalls?.length < 0) return;
    else {
      spinner.start(`\nRunning post installs...\n`);

      postinstalls.forEach(async (postinstall) => {
        await exec(postinstall).then(
          () =>
            spinner.success({
              text: chalk.greenBright(`\nRan ${pack} post installs\n`),
            }),
          () =>
            spinner.error({
              text: chalk.redBright(`\nFailed to run ${pack} post installs\n`),
            }),
        );
      });

      await sleep();
    }

    console.log(chalk.grey(`\nFinished install attempt for ${pack}\n`));
  });
};

process.stdout.write("\x1Bc");

await main().then(console.log("\nDone!"));
