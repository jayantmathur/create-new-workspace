#!/usr/bin/env bun
import { file, sleep, $, spawnSync } from "bun";

import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { clear as clearConsole } from "node:console";

import {
  intro,
  outro,
  text,
  select,
  multiselect,
  confirm,
  isCancel,
} from "@clack/prompts";
import chalk from "chalk";
import boxen from "boxen";

import details from "./package.json";
import {
  initWorkspace,
  createDocs,
  createApp,
  handleCancel,
  editJson,
} from "./utils/helpers";

const __cwd = process.cwd();

const workspaces = await readdir(__cwd).then((elements) =>
  elements.filter((element) => file(resolve(element, "package.json")).size > 0),
);

//
//
// Main
//
//

//
// Start
//

clearConsole();

intro(
  chalk.bold.inverse(` ${details.name} `) + chalk.dim(` v${details.version}`),
);

//
// Get action
//

const action = (await select({
  message: "What would you like to do?",
  options: [
    {
      value: "create",
      label: "Create a new workspace",
    },
    {
      value: "update",
      label: "Update an existing workspace",
    },
    { value: "exit", label: "Exit" },
  ],
  initialValue: "create",
})) as string;

isCancel(action) && handleCancel();
action === "exit" && handleCancel("Exiting...");

//
// Get workspace name
//

let name: string = "";

switch (action) {
  case "create": {
    const input = await text({
      message: "Name of the workspace to create",
      placeholder: "my-workspace",
      validate(input) {
        if (!input.length) return "This is required";
        if (workspaces.includes(input)) return "Workspace already exists";
      },
    });

    isCancel(input) && handleCancel();

    name = input as string;

    break;
  }

  case "update": {
    if (file("./package.json").size > 0) {
      const input = await confirm({
        message: "Update the current workspace?",
        initialValue: true,
      });

      (isCancel(input) || !input) && handleCancel();

      name = "./";

      break;
    }

    if (!workspaces.length) handleCancel("No workspaces found");

    const input = await select({
      message: "Select the workspace to update",
      options: workspaces.map((workspace) => ({
        value: workspace,
        label: workspace,
      })),
      initialValue: workspaces[0],
    });

    isCancel(input) && handleCancel();

    name = input as string;

    break;
  }

  default:
    handleCancel("Exiting...");
    break;
}

//
// Get tasks to perform
//

const tasks = (await multiselect({
  message: "Select the tasks to perform",
  options: [
    { value: "app", label: "Build a new app repository" },
    {
      value: "docs",
      label: "Create a new manuscript or document",
    },
  ],
  required: false,
})) as string[];

isCancel(tasks) && handleCancel();

//
// Get confirmation to proceed
//

console.log(
  boxen(
    `
    Action: ${action}
    Name: ${name}
    Tasks: ${tasks.length ? tasks.join(", ") : "none"}
    `,
    {
      title: "Workspace Configuration",
      titleAlignment: "left",
      textAlignment: "left",
      // padding: {
      //   top: 0.5,
      //   bottom: 0.5,
      // },
      // borderStyle: "round",
    },
  ),
);

const proceed = await confirm({
  message: "Continue with this workspace configuration?",
  initialValue: true,
});

(isCancel(proceed) || !proceed) && handleCancel("Workspace creation cancelled");

//
// Begin workspace action and tasks
//

await initWorkspace(name, action);

action === "create" &&
  (await editJson(resolve(__cwd, name, "package.json"), {
    version: "0.1.0",
    private: true,
    workspaces: [],
    scripts: {
      format:
        'prettier --write "./**/*.{js,ts,jsx,tsx,json}" --log-level silent',
      do: "bun run --filter",
      "do:all": "bun run --filter='*'",
      prepush: "bun format",
      push: "cnwx backup --include docs apps",
      // postpush: "git push",
    },
    devDependencies: {
      prettier: "latest",
    },
  }));

if (tasks.length > 0) {
  console.log("Starting tasks");

  await sleep(1000);

  tasks.includes("app") && (await createApp(name));

  tasks.includes("docs") && (await createDocs(name));

  console.log("Tasks completed.");
}

await $`rm -rf ${resolve(__cwd, name, "node_modules")}`;
spawnSync(["bun", "install"], { cwd: name });

const vscode = await $`which code`.quiet();

outro(
  `${chalk.green("Done!")} ${vscode && chalk.blue("Opening in VS Code...")}`,
);

vscode && spawnSync(["code", resolve(__cwd, name)]);

process.exit(0);
