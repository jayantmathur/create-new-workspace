await Bun.build({
  entrypoints: ["index.ts"],
  outdir: "dist",
  //   target: "bun",
});

await Bun.$`bun build --compile index.ts --outfile dist/index`;

console.log("Bundled!");
