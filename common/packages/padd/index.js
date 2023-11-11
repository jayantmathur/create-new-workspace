#!/usr/bin/env node

import packages from "./list.json" assert { type: "json" };
import { readFile, writeFile } from "fs/promises";
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
  if (packs.length < 1) {
    console.log(chalk.red("No pack(s) provided. Exiting..."));
    process.exit(0);
  }

  console.log(chalk.grey(`List of pack(s): ${packs}\n`));

  for (const pack of packs) {
    console.log(`Installing ${pack}\n`);

    const {
      dependencies = [],
      devDependencies = [],
      scripts = [],
      resources = [],
      postinstalls = [],
    } = packages[pack];

    if (dependencies?.length < 1) return;
    else {
      spinner.start({ text: `Installing dependencies...\n` });

      await exec(`pnpm add ${dependencies.join(" ")}`).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`Added ${pack} dependencies\n`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`Failed to add ${pack} dependencies\n`),
          }),
      );

      await sleep();
    }

    if (devDependencies?.length < 1) return;
    else {
      spinner.start({ text: `Installing devDependencies...\n` });

      await exec(`pnpm add -D ${devDependencies.join(" ")}`).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`Added ${pack} devDependencies\n`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`Failed to add ${pack} devDependencies\n`),
          }),
      );

      await sleep();
    }

    if (scripts?.length < 1) return;
    else {
      spinner.start({ text: `Adding scripts...\n` });

      await appendJson("package.json", { scripts }).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`Added ${pack} scripts\n`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`Failed to add ${pack} scripts\n`),
          }),
      );

      await sleep();
    }

    if (resources?.length < 1) return;
    else {
      spinner.start({ text: `Adding resources...\n` });

      resources.forEach(async (resource) => {
        await copyFolder(
          `${__dirname}/resources/${resource.src}`,
          `${resource.dest || "./"}`,
        ).then(
          () =>
            spinner.success({
              text: chalk.greenBright(`Added ${pack} resources\n`),
            }),
          () =>
            spinner.error({
              text: chalk.redBright(`Failed to add ${pack} resources\n`),
            }),
        );
      });

      await sleep();
    }

    if (postinstalls?.length < 1) return;
    else {
      spinner.start({ text: `Running post installs...\n` });

      const promises = postinstalls.map(async (postinstall) => {
        await exec(postinstall);
      });

      await Promise.all(promises).then(
        () =>
          spinner.success({
            text: chalk.greenBright(`Ran ${pack} post installs\n`),
          }),
        () =>
          spinner.error({
            text: chalk.redBright(`Failed to run ${pack} post installs\n`),
          }),
      );

      await sleep();
    }

    console.log(chalk.grey(`Finished install attempt for ${pack} pack\n`));
  }
};

process.stdout.write("\x1Bc");

await main().then(console.log("Done!"));
