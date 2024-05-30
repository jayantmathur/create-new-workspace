import { file, write, $, spawnSync, sleep } from "bun";

import { readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { spinner as clkSpinner, cancel, text } from "@clack/prompts";

const __dirname = resolve(import.meta.dir, "../");
const __cwd = process.cwd();

const spinner = clkSpinner();

export const handleCancel = (message = "Operation cancelled. Exiting") => {
  cancel(message);
  process.exit(1);
};

export const copyDirectory = async (src: string, dest: string) => {
  !src && console.error("Copy:source not provided");
  !dest && console.error("Copy:destination not provided");

  const entries = await readdir(src, {
    withFileTypes: true,
    recursive: true,
  }).then((elements) => elements.filter((entry) => entry.isFile()));

  for (let entry of entries)
    await write(resolve(dest, entry.name), file(resolve(src, entry.name)), {
      createPath: true,
    });
};

export const initWorkspace = async (name: string, action: string) => {
  const path = resolve(__cwd, name);

  spinner.start(
    ((action === "update" && "Reinitializing") || "Initializing") +
      " workspace...",
  );

  if (action === "create") {
    await $`mkdir ${path}`.nothrow().quiet();
    spawnSync(["bun", "init", "--yes"], { cwd: path, stdout: "ignore" });
    await $`rm -rf ${resolve(path, "index.ts")}`;
  }

  await write(
    resolve(path, ".prettierrc"),
    JSON.stringify(
      {
        overrides: [
          {
            files: ["*.tex"],
            options: {
              plugins: ["prettier-plugin-latex"],
            },
          },
          {
            files: ["*.qmd"],
            options: {
              parser: "markdown",
            },
          },
        ],
      },
      null,
      2,
    ),
  );

  await write(
    resolve(path, ".prettierignore"),
    ["_extensions", "resources", "src-tauri", "node_modules", ".*"].join("\n"),
  );

  await write(
    resolve(path, ".vscode", "tasks.json"),
    JSON.stringify(
      {
        version: "2.0.0",
        tasks: [
          {
            label:
              "Check saved version in .backup and import changes if they exist",
            type: "shell",
            command: "cnwx backup --sync",
            runOptions: { runOn: "folderOpen" },
          },
          {
            label: "versionlens bun install",
            command: "bun",
            type: "shell",
            args: ["install"],
            // customizable settings
            presentation: {
              echo: true,
              reveal: "always",
              panel: "shared",
              clear: true,
            },
          },
        ],
      },
      null,
      2,
    ),
  );

  await sleep(1000);

  spinner.stop("Workspace " + action + "d.");

  return true;
};

export const createDocs = async (parent: string) => {
  const name = (await text({
    message: "Enter the name of the documents repo",
    placeholder: generateRandomWord(),
    validate(input) {
      if (!input.length) return "This is required";
      if (input.length < 4) return "Name must be at least 4 characters";
      if (input.length > 7) return "Name must not exceed 7 characters";
    },
  })) as string;

  const path = resolve(__cwd, parent, "docs");

  spinner.start("Creating documents repo...");

  await copyDirectory(resolve(__dirname, "src", "docs"), resolve(path, name));

  await copyDirectory(
    resolve(__dirname, "public"),
    resolve(path, name, "public"),
  );

  await editJson(resolve(path, name, "package.json"), {
    name: name,
  });

  await editJson(resolve(__cwd, parent, "package.json"), {
    workspaces: ["docs/*"],
  });

  spinner.stop("Documents repo created.");

  await sleep(1000);
};

export const createApp = async (parent: string) => {
  const name = (await text({
    message: "Enter the name of the app repo",
    placeholder: generateRandomWord(),
    validate(input) {
      if (!input.length) return "This is required";
      if (input.length < 4) return "Name must be at least 4 characters";
      if (input.length > 7) return "Name must not exceed 7 characters";
    },
  })) as string;

  const path = resolve(__cwd, parent, "apps");

  spinner.start("Creating app repo...");

  await $`mkdir ${path}`.quiet().nothrow();

  spawnSync(
    [
      "bun",
      "create",
      "next-app",
      name,
      "--typescript",
      "--eslint",
      "--tailwind",
      // "--src-dir",
      "--no-src-dir",
      "--app",
      "--import-alias",
      "@/*",
      "--no-git",
    ],
    {
      cwd: path,
      stdout: "ignore",
    },
  );

  await $`rm -rf ${["package-lock.json", "node_modules", "README.md", ".git"].map((element) => resolve(path, name, element)).join(" ")}`
    .quiet()
    .nothrow();

  await copyDirectory(
    resolve(__dirname, "public"),
    resolve(path, name, "public"),
  );

  // await $`bun create next-app ${parent}/apps/${name} --typescript --eslint --tailwind --src-dir --app --import-alias "@/*" --no-git`.quiet();

  await editJson(resolve(path, name, "package.json"), {
    name: name,
    scripts: {
      dev: "next dev --turbo",
      push: "npm version",
    },
  });

  await editJson(resolve(__cwd, parent, "package.json"), {
    workspaces: ["apps/*"],
  });

  await $`rm -rf ${resolve(path, name, "package-lock.json")} ${resolve(path, name, "node_modules")}`;

  spinner.stop("App repo created.");

  await sleep(1000);
};

export const deepMerge = (
  source: { [key: string]: any },
  target: { [key: string]: any },
): { [key: string]: any } => {
  let result = { ...source };

  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      if (Array.isArray(target[key]) && Array.isArray(result[key])) {
        result[key] = Array.from(new Set([...result[key], ...target[key]]));
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

export const editJson = async (path: string, data: { [key: string]: any }) => {
  const details: JSON = await file(resolve(__cwd, path)).json();

  const payload = deepMerge(details, data);

  await write(resolve(path), JSON.stringify(payload, null, 2));

  return true;
};

export const generateRandomWord = (length = 4) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result.toLowerCase();
};
