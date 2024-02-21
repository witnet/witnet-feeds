#!/usr/bin/env node

const { spawn } = require("node:child_process");
const os = require("os")
const utils = require("./utils")
const Witnet = require("witnet-toolkit")

const addresses = require("../witnet/addresses.json")
const assets = require("../witnet/assets")
const requests = Witnet.Dictionary(Witnet.Artifacts.Class, assets?.requests)

function cmd(...command) {
    let p = spawn(command[0], command.slice(1));
    return new Promise((resolve) => {
        p.stdout.on("data", (x) => {
            process.stdout.write(x.toString());
        });
        p.stderr.on("data", (x) => {
            process.stderr.write(x.toString());
        });
        p.on("exit", (code) => {
            resolve(code);
        });
    });
};

async function main() {

    if (process.argv.length < 3) {
        console.error("\nUsage:\n\n$ node ./scripts/deploy.js <ecosystem>:<network> [...captions]\n")
        process.exit(0)
    }
    const network = process.argv[2]
    if (!addresses[network]) {
        console.error("\nUnsupported network:", network)
        process.exit(0)
    }
    const artifacts = []
    const captions = []
    for (let index = 3; index < process.argv.length; index ++) {
        if (process.argv[index].startsWith("-")) break;
        const caption = "Price-" + process.argv[index].toUpperCase()
        let artifact
        try {
            artifact = utils.extractRequestKeyFromErc2362Caption(caption)
        } catch {
            console.error("\nCaption badly formated:", process.argv[index])
            process.exit(1)
        }
        try {
            requests[artifact]
            artifacts.push(artifact)
        } catch {}
    }
    const npx = os.type() === "Windows_NT" ? "npx.cmd" : "npx"
    if (artifacts.length > 0) {
        await cmd(npx, "witnet", "deploy", network, "--artifacts", artifacts.join(","))
    } else {
        await cmd(npx, "witnet", "deploy", network)
    }
    cmd(npx, "hardhat", "--network", network, "pfs:deploy", ...process.argv.slice(3))
};

main();