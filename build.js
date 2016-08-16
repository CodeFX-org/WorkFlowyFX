// library functions
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const copyfiles = require('copyfiles')
const merge = require('merge')
const fs = require('fs')

// placeholders
const ch = 'chrome'
const ff = 'firefox'
const p_src = './src'
const p_resrc = `${p_src}/resources`
const p_plugins = './plugins'
const p_ch = `${p_plugins}/chrome`
const p_ff = `${p_plugins}/firefox`

// execute specified build target(s)

if (process.argv.length == 2)
	all()
else
	process.argv
		.slice(2)
		.forEach(target => build(target))

function build(target) {
	var targetAsFunction = {
		"clean" : clean,
		"c" : clean,
		"chrome" : chrome,
		"ch" : chrome,
		"firefox" : firefox,
		"ff" : firefox
	}[target]
	if (targetAsFunction)
		targetAsFunction()
	else
		console.log(`Target "${target}" does not exist.`)
}

// target definitions

// - aggregates

function all() {
	clean()
	buildChrome()
	buildFirefox()
}

function chrome() {
	clean()
	buildChrome()
}

function firefox() {
	clean()
	buildFirefox()
}

// - atoms

function clean() {
	console.log(`deleting "${p_plugins}"`)
	rimraf.sync(p_plugins, { }, abortBuildIfError)
	console.log()
}

function buildChrome() {
	console.log('building Chrome plugin')

	console.log('creating folders')
	mkdirp.sync(p_ch, abortBuildIfError)

	console.log('creating manifest')
	fs.writeFile(`${p_ch}/manifest.json`, createManifestStringFor(chrome), abortBuildIfError)

	console.log('copying source')
	copyFlat(`${p_src}/workflowyfx.js`, `${p_ch}`)

	console.log()
}

function buildFirefox() {
	console.log('building Firefox plugin')

	console.log('creating folders')
	mkdirp.sync(`${p_ff}/icons`, abortBuildIfError)
	copyFlat(`${p_resrc}/icon.png`, `${p_ff}/icons`)

	console.log('creating manifest')
	fs.writeFile(`${p_ff}/manifest.json`, createManifestStringFor(firefox), abortBuildIfError)

	console.log('copying source')
	copyFlat(`${p_src}/workflowyfx.js`, `${p_ff}`)

	console.log()
}

// helpers

function copyFlat() {
	copyfiles(Array.prototype.slice.call(arguments), true, abortBuildIfError)
}

function abortBuildIfError(error) {
	if (error) {
		console.log(`Error: ${error}`)
		console.log(`Aborting build...`)
		process.exit(1)
	}
}

function createManifestStringFor(browser) {
	return replaceConfigVariables(createBrowserSpecificManifest(browser));
}

function createBrowserSpecificManifest(browser) {
	var source = require(`${p_src}/manifest`)
	return merge(source["shared"], source[browser]);
}

function replaceConfigVariables(merged) {
	return JSON.stringify(merged, null, '\t').replace(
		// variables have the form "$config_foo", where package.json defines the config parameter "foo"
		new RegExp(/\$config_(\w+)/, "g"),
		(match, parameterName) => process.env[`npm_package_config_${parameterName}`])
}
