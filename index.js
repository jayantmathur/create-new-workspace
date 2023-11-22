#!/usr/bin/env node

import { dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import { readdir, mkdir, writeFile, rm } from "fs/promises";
import { exec as syncExec, execFile } from "child_process";
import { promisify } from "util";
import chalk from "chalk";
import { input, select, checkbox, confirm } from "@inquirer/prompts";
import { createSpinner } from "nanospinner";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  sleep,
  getRandomName,
  copyFolder,
  deleteFolder,
  appendJson,
} from "./utils/functions.js";
import json from "./package.json" assert { type: "json" };

const args = yargs(hideBin(process.argv))
  .option("defaults", {
    alias: "d",
    description: "Flag to use defaults everywhere",
    type: "boolean",
    default: false,
  })
  .help()
  .alias("help", "h").argv;

const { defaults } = args;

const __dirname = dirname(fileURLToPath(import.meta.url));

const spinner = createSpinner();

const handleFullFilled = () => {};

const handleError = () => {
  console.error(chalk.redBright("Action failed! Exiting.."));
  process.exit(1);
};

const exec = promisify(syncExec);

const { version, description, author } = json;

const space = {
  name: "my-new-workspace",
  app: "napp",
  doc: "ndoc",
};

const getAction = async () =>
  await select({
    name: "action",
    message: "What do you want to do?",
    choices: [
      {
        name: "Create a new workspace",
        value: "cnw",
      },
      {
        name: "Update an existing workspace",
        value: "uew",
      },
      {
        name: "Exit",
        value: "exit",
      },
    ],
  });

const getTasks = async () =>
  await checkbox({
    name: "tasks",
    message: "Do you want to run any tasks?\n",
    choices: [
      {
        name: "Create a new app",
        value: "app",
      },
      {
        name: "Create a new document",
        value: "doc",
      },
    ],
  });

const createWorkspace = async () => {
  const name = !defaults
    ? await input({
        name: "name",
        message: "What is the name of the workspace?",
        default: await getRandomName(),
      })
    : await getRandomName();

  if (existsSync(name)) {
    const overwrite = await confirm({
      name: "overwrite",
      message: "Workspace already exists! Overwrite?",
      default: false,
    });

    !overwrite && handleError();
    await deleteFolder(name);
  }

  space.name = name;

  spinner.start({ text: "Creating workspace...\n" });

  await sleep();

  await mkdir(name, (err) => err && handleError());

  await exec("pnpm init", { cwd: name });

  await writeFile(
    `${name}/pnpm-workspace.yaml`,
    `packages: ["apps/*","docs/*","packages/*"]`,
    (err) => err && handleError(),
  );

  spinner.update({ text: "Copying common files...\n" });

  await sleep();

  await copyFolder(`${__dirname}\\common`, space.name);

  spinner.update({ text: "Installing workspace packages...\n" });

  await sleep();

  await exec(`pnpm add backup -Dw --workspace`, {
    cwd: space.name,
  }).then(handleFullFilled, handleError);

  await appendJson(`${name}\\package.json`, {
    description: "A new workspace",
    author: author,
    scripts: {
      do: "pnpm run --parallel --recursive --if-present",
      save: "backup --noDev",
      push: "pnpm do push",
      postpush: "pnpm save",
    },
  });

  spinner.success({ text: chalk.greenBright("Workspace created!\n") });
};

const updateWorkspace = async () => {
  const name = !defaults
    ? await input({
        name: "name",
        message: "What is the name of the workspace?",
        default: ".\\",
      })
    : ".\\";

  space.name = name;

  spinner.start({ text: "Updating workspace...\n" });

  await sleep();

  if (!name.includes(".\\")) {
    const dirs = await readdir(process.cwd());

    if (!dirs.includes(name)) handleError();

    spinner.success({ text: chalk.greenBright("Workspace found!\n") });
  } else {
    spinner.warn({ text: chalk.gray("Using current directory!\n") });
  }

  console.log("Updating common files...\n");

  await sleep();

  await copyFolder(`${__dirname}\\common`, space.name);
};

const createApp = async () => {
  const name = !defaults
    ? await input({
        name: "name",
        message: "What is the name of the app?",
        default: await getRandomName(4),
      })
    : await getRandomName(4);

  space.app = name;

  spinner.start({ text: "Creating app...\n" });

  await sleep();

  !existsSync(`${space.name}\\apps`) &&
    (await mkdir(
      `${space.name}\\apps`,
      { recursive: true },
      (err) => err && handleError(),
    ));

  await exec(
    `pnpm create next-app ${name} --typescript --eslint --tailwind --no-src-dir --app --import-alias "@/*" --no-git`,
    {
      cwd: `${space.name}\\apps`,
    },
  ).then(handleFullFilled, handleError);

  await appendJson(`${space.name}\\apps\\${name}\\package.json`, {
    name: `@apps/${name}`,
    description: "A new Next.js app",
    author: author,
    scripts: {
      dev: "next dev --turbo",
      push: "pnpm version --force",
      padd: "padd",
    },
  });

  spinner.update({ text: "Installing workspace packages...\n" });

  await exec(`pnpm add -Dw typesync prettier-plugin-tailwindcss`, {
    cwd: `${space.name}`,
  }).then(handleFullFilled, handleError);

  spinner.update({ text: "Installing app dependencies...\n" });

  await exec(`pnpm add sharp`, {
    cwd: `${space.name}\\apps\\${name}`,
  }).then(handleFullFilled, handleError);

  await exec(`pnpm add padd --filter @apps/${name} --workspace`, {
    cwd: `${space.name}`,
  }).then(handleFullFilled, handleError);

  spinner.update({ text: "Copying resources...\n" });

  await copyFolder(
    `${__dirname}\\resources\\web`,
    `${space.name}\\packages\\padd\\resources\\web`,
  );

  await copyFolder(`${__dirname}\\src\\app`, `${space.name}\\apps\\${name}`);

  spinner.success({ text: chalk.greenBright("App repository created!\n") });
};

const createDocument = async () => {
  const name = !defaults
    ? await input({
        name: "name",
        message: "What is the name of the document?",
        default: await getRandomName(4),
      })
    : await getRandomName(4);

  space.doc = name;

  spinner.start({ text: "Creating document...\n" });

  await sleep();

  !existsSync(`${space.name}\\docs`) &&
    (await mkdir(
      `${space.name}\\docs`,
      { recursive: true },
      (err) => err && handleError(),
    ));

  await copyFolder(`${__dirname}\\src\\doc`, `${space.name}\\docs\\${name}`);

  spinner.update({ text: "Copying resources...\n" });

  await sleep();

  await copyFolder(
    `${__dirname}\\resources\\doc`,
    `${space.name}\\packages\\padd\\resources\\doc`,
  );

  spinner.update({ text: "Installing extensions...\n" });

  await sleep(3000);

  const promises = [
    ...[
      // "jmgirard/lordicon",
      "quarto-ext/lightbox",
      "quarto-ext/fontawesome",
      "quarto-ext/attribution",
      "shafayetShafee/material-icons",
    ].map(
      async (extension) =>
        await exec(`quarto add ${extension} --no-prompt --quiet`, {
          cwd: `${space.name}\\docs\\${name}`,
          // stdio: 'inherit'
        }),
    ),
    ...[
      "schochastics/academicons",
      "quarto-ext/latex-environment",
      "shafayetShafee/bsicons",
    ].map(
      async (extension) =>
        await exec(
          `quarto install extension ${extension} --no-prompt --quiet`,
          {
            cwd: `${space.name}\\docs\\${name}`,
            // stdio: 'inherit'
          },
        ),
    ),
  ];

  await Promise.all(promises).then(handleFullFilled, handleError);

  await copyFolder(
    `${__dirname}\\resources\\doc\\quarto\\main`,
    `${space.name}\\docs\\${name}\\_extensions\\main`,
  );

  await appendJson(`${space.name}\\docs\\${name}\\package.json`, {
    name: `@docs/${name}`,
    description: "A new Quarto document",
    author: author,
  });

  spinner.success({
    text: chalk.greenBright("Document repository created!\n"),
  });
};

const handleClose = async () => {
  await exec(`pnpm install --force`, {
    cwd: space.name,
  }).then(handleFullFilled, handleError);

  await exec(`pnpm prune`, {
    cwd: space.name,
  }).then(handleFullFilled, handleError);

  console.log("Cleaning remnants...\n");

  // await rm(`${space.name}\\.git`, { force: true, recursive: true });
  // await rm(`${space.name}\\.gitignore`, { force: true, recursive: true });

  console.log(chalk.blueBright("Opening workspace in VS Code...\n"));

  await sleep();

  await exec(`code ${space.name}`).then(handleFullFilled, handleError);
  // await execFile(`${__dirname}\\utils\\code.bat`, [space.name]).then(
  //   handleFullFilled,
  //   handleError,
  // );

  process.exit(0);
};

const main = async () => {
  const action = await getAction();

  switch (action) {
    case "exit":
      console.log(chalk.redBright("Exiting...\n"));
      process.exit(0);
    case "cnw":
      await createWorkspace();
      break;
    case "uew":
      await updateWorkspace();
      break;
    default:
      break;
  }

  const tasks = await getTasks();

  if (tasks.length < 1) return;

  console.log("Running tasks...\n");

  tasks.includes("app") && (await createApp());
  tasks.includes("doc") && (await createDocument());
};

process.stdout.write("\x1Bc");

console.log(
  chalk.cyan.bold("create-new-workspace"),
  chalk.bgYellow(` v${version} `),
  chalk.gray(`by ${author}`),
  "",
  chalk.grey(description),
);

await main().then(handleClose);
