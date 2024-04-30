import { argv } from "bun";

if (argv.length < 4) {
  console.error("Usage: <command> ...[--key ...values]");
  process.exit(1);
}

const command = argv[2];
const args = argv.slice(3);

const keyValues: { [key: string]: string[] } = {};
let currentKey = "";

for (let arg in args) {
  if (!arg.startsWith("--")) keyValues[currentKey].push(arg);

  currentKey = arg;
  keyValues[currentKey] = [];
}

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    currentKey = args[i];
    keyValues[currentKey] = [];
  } else {
  }
}

console.log(`Command: ${command}`);
console.log("Key-Values:", keyValues);
