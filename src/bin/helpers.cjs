const fs = require("fs")
const merge = require("lodash.merge")

const camelize = (str) => capitalizeFirstLetter(str.toLowerCase())

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

const colorstrip = (str) => str.replace(
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ""
)

const commas = (number) => {
	const parts = number.toString().split(".")
	const result =
		parts.length <= 1
			? `${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
			: `${parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${parts[1]}`
	return result
}

const blue = (str) => `\x1b[34m${str}\x1b[0m`
const cyan = (str) => `\x1b[36m${str}\x1b[0m`
const gray = (str) => `\x1b[90m${str}\x1b[0m`
const green = (str) => `\x1b[32m${str}\x1b[0m`
const magenta = (str) => `\x1b[0;35m${str}\x1b[0m`
const red = (str) => `\x1b[31m${str}\x1b[0m`
const yellow = (str) => `\x1b[33m${str}\x1b[0m`
const white = (str) => `\x1b[0;38m${str}\x1b[0m`
const lblue = (str) => `\x1b[1;94m${str}\x1b[0m`
const lcyan = (str) => `\x1b[1;96m${str}\x1b[0m`
const lgreen = (str) => `\x1b[1;92m${str}\x1b[0m`
const lmagenta = (str) => `\x1b[1;95m${str}\x1b[0m`
const lwhite = (str) => `\x1b[0;1;98m${str}\x1b[0m`
const lyellow = (str) => `\x1b[1;93m${str}\x1b[0m`
const mblue = (str) => `\x1b[94m${str}\x1b[0m`
const mcyan = (str) => `\x1b[96m${str}\x1b[0m`
const mgreen = (str) => `\x1b[92m${str}\x1b[0m`
const mmagenta = (str) => `\x1b[0;95m${str}\x1b[0m`
const mred = (str) => `\x1b[91m${str}\x1b[0m`
const myellow = (str) => `\x1b[93m${str}\x1b[0m`

function parseIntFromArgs(args, flag) {
	const argIndex = args.indexOf(flag)
	if (argIndex >= 0 && args.length > argIndex + 1) {
		const value = parseInt(args[argIndex + 1], 10)
		args.splice(argIndex, 2)
		return value
	}
}

function prompter (promise) {
  const loading = (() => {
    const h = ["|", "/", "-", "\\"]
    let i = 0
    return setInterval(() => {
      i = (i > 3) ? 0 : i
      process.stdout.write(`\b\b${h[i]} `)
      i++
    }, 50)
  })()
  return promise
    .then(result => {
      clearInterval(loading)
      process.stdout.write("\b\b")
      return result
    })
}

function readWitnetJsonFiles (...filenames) {
  return Object.fromEntries(filenames.map(key => {
    const filepath = `./witnet/${key}.json`
    return [
      key,
      fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath)) : {},
    ]
  }))
}

function saveWitnetJsonFiles (data) {
  Object.entries(data).forEach(([key, obj]) => {
    const filepath = `./witnet/${key}.json`
    if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, "{}")
    const json = merge(JSON.parse(fs.readFileSync(filepath)), obj)
    fs.writeFileSync(filepath, JSON.stringify(json, null, 4), { flag: "w+" })
  })
}

function spliceFromArgs(args, flag) {
	const argIndex = args.indexOf(flag)
	if (argIndex >= 0 && args.length > argIndex + 1) {
		const value = args[argIndex + 1]
		args.splice(argIndex, 2)
		return value
	}
}

function traceHeader(header, color = white, indent = "") {
	console.info(`${indent}┌─${"─".repeat(header.length)}─┐`)
	console.info(`${indent}│ ${color(header)} │`)
	console.info(`${indent}└─${"─".repeat(header.length)}─┘`)
}

function traceTable(records, options) {
	const stringify = (data, humanizers, index) => humanizers && humanizers[index] ? humanizers[index](data).toString() : data?.toString() ?? ""
	const reduceMax = (numbers) => numbers.reduce((curr, prev) => Math.max(curr, prev), 0)
	if (!options) options = {}
	const indent = options?.indent || ""
	const numColumns = reduceMax(records.map(record => record?.length || 1))
	const maxColumnWidth = options?.maxColumnWidth || 80
	const table = transpose(records, numColumns)
	options.widths = options?.widths || table.map((column, index) => {
		let maxWidth = reduceMax(column.map(field => colorstrip(stringify(field, options?.humanizers, index)).length))
		if (options?.headlines && options.headlines[index]) {
			maxWidth = Math.max(maxWidth, colorstrip(options.headlines[index].replaceAll(":", "")).length)
		}
		return Math.min(maxWidth, maxColumnWidth)
	})
	let headline = options.widths.map(maxWidth => "─".repeat(maxWidth))
	console.info(`${indent}┌─${headline.join("─┬─")}─┐`)
	if (options?.headlines) {
		headline = options.widths.map((maxWidth, index) => {
			const caption = options.headlines[index].replaceAll(":", "")
			const captionLength = colorstrip(caption).length
			return `${white(caption)}${" ".repeat(maxWidth - captionLength)}`
		})
		console.info(`${indent}│ ${headline.join(" │ ")} │`)
		headline = options.widths.map(maxWidth => "─".repeat(maxWidth))
		console.info(`${indent}├─${headline.join("─┼─")}─┤`)
	}
	for (let i = 0; i < records.length; i++) {
		let line = ""
		for (let j = 0; j < numColumns; j++) {
			let data = table[j][i]
			let color
			if (options?.colors && options.colors[j]) {
				color = options.colors[j]
			} else {
				color = typeof data === "string"
					? green
					: (Number(data) === data && data % 1 !== 0 // is float number?
						? yellow
						: (x) => x
					)
			}
			data = stringify(data, options?.humanizers, j)
			if (colorstrip(data).length > maxColumnWidth) {
				while (colorstrip(data).length > maxColumnWidth - 3) {
					data = data.slice(0, -1)
				}
				data += "..."
			}
			const dataLength = colorstrip(data).length
			if (options?.headlines && options.headlines[j][0] === ":") {
				data = `${color(data)}${" ".repeat(options.widths[j] - dataLength)}`
			} else {
				data = `${" ".repeat(options.widths[j] - dataLength)}${color(data)}`
			}
			line += `│ ${data} `
		}
		console.info(`${indent}${line}│`)
	}
	headline = options.widths.map(maxWidth => "─".repeat(maxWidth))
	console.info(`${indent}└─${headline.join("─┴─")}─┘`)
}

function transpose (records, numColumns) {
  const columns = []
  for (let index = 0; index < numColumns; index++) {
    columns.push(records.map(row => row[index]))
  }
  return columns
}

module.exports = {
	colors: {
		blue,
		cyan,
		gray,
		green,
		red,
		yellow,
		white,
		magenta,
		lblue,
		lcyan,
		lgreen,
		lmagenta,
		lwhite,
		lyellow,
		mblue,
		mcyan,
		mgreen,
		mred,
		myellow,
		mmagenta,
	},
	camelize,
	commas,
	colorstrip,
	parseIntFromArgs,
	prompter,
	readWitnetJsonFiles,
  	saveWitnetJsonFiles,
	spliceFromArgs,
	traceHeader,
	traceTable,
}
