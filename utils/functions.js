import { readFile, writeFile } from "fs/promises";
import fse from "fs-extra";
import { basename } from "path";
import crypto from "crypto";
import trash from "trash";
import lodash from "lodash";
const { merge } = lodash;

const sleep = async (ms = 1000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getRandomName = async (length = 6) => {
  let randomName = "";
  while (randomName.length < length) {
    const byte = crypto.randomBytes(1)[0];
    if ((byte >= 65 && byte <= 90) || (byte >= 97 && byte <= 122)) {
      randomName += String.fromCharCode(byte);
    }
  }
  return randomName.toLowerCase();
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

const deleteFolder = async (path) => {
  const folder = path.split("\\").pop();

  try {
    await trash(path);
    console.log(`Folder ${folder} has been moved to the recycle bin`);
  } catch (err) {
    console.error(err);
  }
};

const appendJson = async (path = "", data = {}) => {
  const content = await readFile(path, "utf8");
  const merged = merge({}, JSON.parse(content), data);
  await writeFile(path, JSON.stringify(merged, null, 2), "utf8");
};

export { sleep, getRandomName, copyFolder, deleteFolder, appendJson };
