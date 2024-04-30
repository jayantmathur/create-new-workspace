#!/usr/bin/env bun
import cli from "./utils/cli";
import { paddDocs, paddApps } from "./utils/helpers";
import list from "./list.json";

import type { CLIOptions, ListType, DocType, AppType } from "./utils/types";

const packages = list as ListType;
const { path, packs, extras } = cli as unknown as CLIOptions;

for (let pack of packs) {
  const name = pack.toLowerCase();
  const current = packages[name];

  if (!current) {
    console.error(`Not found: ${name}. Skipping...`);
    continue;
  }

  Object.assign(current, { name });

  current.type === "doc" && (await paddDocs(path, current as DocType));

  current.type === "app" && (await paddApps(path, current as AppType, extras));
}

process.exit(0);
