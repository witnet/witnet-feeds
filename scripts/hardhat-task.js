#!/usr/bin/env node

const { spawn } = require('node:child_process');
const os = require("os")

if (process.argv.length < 4) {
    console.error("\nUsage:\n\n$ node ./scripts/package-pfs.js <hardhat-task> <ecosystem>:<network> ...HARDHAT_TASK_ARGS\n")
    process.exit(0)
}

const shell = spawn(os.type() === "Windows_NT" ? "npx.cmd" : "npx", [
    "hardhat",
    "--network",
    process.argv[3],
    process.argv[2],
    ...process.argv.slice(4)
]);

shell.stdout.on('data', (data) => {
    process.stdout.write(data.toString())
});

shell.stderr.on('data', (data) => {
    process.stderr.write(data.toString())
});
