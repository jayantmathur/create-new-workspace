#!/usr/bin/env node

const packages = require("./list.json");
const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const merge = require("deepmerge");
const fse = require("fs-extra");
const args = require("yargs").argv;

const appendJson = async (filename, data) => {
  const file = readFileSync(filename);

  //check if file is empty
  if (file.length == 0) writeFileSync(filename, JSON.stringify(data));
  else {
    const result = merge.all([JSON.parse(file.toString()), data]);
    writeFileSync(filename, JSON.stringify(result));
  }
};

(async () => {
  const { packs, path } = args;

  if (packs && path) {
    const categories = packs?.split(/\,|\s/);

    categories?.forEach(async (category) => {
      const depsList = packages[category]["dependencies"]
        ?.toString()
        .replaceAll(",", " ");

      if (depsList?.length > 1) {
        execSync(`pnpm add -W ${depsList}`, {
          stdio: "ignore",
          cwd: `${path}`,
        });
        console.log(`Added dependencies [${depsList}] to ${path}`);
      }

      const devDepsList = packages[category]["devDependencies"]
        ?.toString()
        .replaceAll(",", " ");

      if (devDepsList?.length > 1) {
        execSync(`pnpm add -DW ${devDepsList}`, {
          stdio: "ignore",
          cwd: `${path}`,
        });

        console.log(`Added devDependencies [${devDepsList}] to ${path}`);
      }

      const scriptsList = packages[category]["scripts"];

      if (scriptsList && JSON.stringify(scriptsList) !== "{}") {
        await appendJson(`${path}/package.json`, {
          scripts: scriptsList || {},
        });
        console.log(`Added necessary scripts package.json`);
      }

      const postinstall = packages[category]["postinstalls"];

      if (postinstall?.length > 0)
        postinstall.forEach((element, index) => {
          execSync(`${element}`, { cwd: `${path}`, stdio: "inherit" });
          console.log(`Ran postinstall script ${index + 1}`);
        });

      const resourcesList = packages[category]["resources"];
      if (resourcesList?.length > 0) {
        resourcesList.forEach((resource) => {
          try {
            fse.copySync(
              `./resources/${resource.src}`,
              `${path}/${resource.dest || ""}`,
              {
                overwrite: true | false,
              },
            );

            console.log(`Added sample resources to ${path}`);
          } catch (err) {
            console.error(err);
          }
        });
      }
    });
  }
})();
