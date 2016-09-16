// library functions
const rimraf = require(`rimraf`)
const mkdirp = require(`mkdirp`)
const copyfiles = require(`copyfiles`)
const merge = require(`merge`)
const fs = require(`fs`)
const browserify = require(`browserify`)

// paths and more
const p_src = `./src`
const p_resrc = `${p_src}/resources`
const p_plugins = `./plugins`
const browsers = {
	chrome : {
		name: "chrome",
		targetPath: `${p_plugins}/chrome`,
		targetResourcesPath: `${p_plugins}/chrome/${process.env.npm_package_config_resources}`
	},
	firefox : {
		name: "firefox",
		targetPath: `${p_plugins}/firefox`,
		targetResourcesPath: `${p_plugins}/firefox/${process.env.npm_package_config_resources}`
	}
}

// execute specified build target(s)

// extract the command line arguments specifying what to build
// (first two arguments are the Node executable and the script file
//  https://nodejs.org/docs/latest/api/process.html#process_process_argv )
if (process.argv.length == 2)
	all()
else
	process.argv
		.slice(2)
		.forEach(target => buildTarget(target))

function buildTarget(target) {
	var targetAsFunction = {
		clean : clean,
		c : clean,
		chrome : chrome,
		ch : chrome,
		firefox : firefox,
		ff : firefox
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
	buildBrowser(browsers.chrome)
	buildBrowser(browsers.firefox)
}

function chrome() {
	clean()
	buildBrowser(browsers.chrome)
}

function firefox() {
	clean()
	buildBrowser(browsers.firefox)
}

// - atoms

function clean() {
	console.log(`deleting "${p_plugins}"`)
	rimraf.sync(p_plugins, { }, abortBuildIfError)
	console.log()
}

function buildBrowser(browser) {
	console.log(`building ${browser.name} plugin`)

	createFolders(browser);
	createManifest(browser);
	bundleSources(browser);
	copyResources(browser)

	console.log()
}

// helpers

function createFolders(browser) {
	console.log(`creating target folder "${browser.targetPath}"`)
	mkdirp.sync(browser.targetPath, abortBuildIfError)
	mkdirp.sync(browser.targetResourcesPath, abortBuildIfError)
}

function createManifest(browser) {
	console.log(`creating manifest`)
	fs.writeFile(`${browser.targetPath}/manifest.json`, createManifestStringFor(browser), abortBuildIfError)
}

function createManifestStringFor(browser) {
	return replaceConfigVariables(createBrowserSpecificManifest(browser));
}
function createBrowserSpecificManifest(browser) {
	var source = require(`${p_src}/manifest.json`)
	// extract the shared part of the manifest and merge it with the browser-specific part
	return merge(true, source["shared"], source[browser.name]);
}

function replaceConfigVariables(merged) {
	return JSON.stringify(merged, null, `\t`).replace(
		// variables in the manifest have the form "$config_foo",
		// where package.json defines the config parameter "foo"
		new RegExp(/\$config_(\w+)/, "g"),
		// replace the match with the package.json entry
		(match, parameterName) => process.env[`npm_package_config_${parameterName}`]
	)
}

function bundleSources(browser) {
	console.log(`bundling sources and dependencies into "${process.env.npm_package_main}"`)
	bundleSourceFromTo(`${p_src}/${process.env.npm_package_main}`, `${browser.targetPath}/${process.env.npm_package_main}`)
}

function bundleSourceFromTo(entries, target) {
	browserify(entries).bundle().pipe(fs.createWriteStream(target))
}

function copyResources(browser) {
	console.log(`copying resources into "${browser.targetResourcesPath}"`)
	copyFlat(`${p_resrc}/icon.png`, browser.targetResourcesPath)
}

// low level

function copyFlat() {
	// copyfiles requires an array so create one from the arguments
	copyfiles(Array.prototype.slice.call(arguments), true, abortBuildIfError)
}

function abortBuildIfError(error) {
	if (error) {
		console.log(`Error: ${error}`)
		console.log(`Aborting build...`)
		process.exit(1)
	}
}

