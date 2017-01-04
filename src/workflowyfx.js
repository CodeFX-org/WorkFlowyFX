`use strict`;
// looks like browserify can not resolve template strings
// so don#t make this require(`jquery`)
const $ = require('jquery')

console.log(`Hello, WorkFlowy!`)

//++++++++++++++++//
// SHOW ALL NOTES //
//++++++++++++++++//

// Create a CSS class that selects all notes and displays their full content
// by mimicking WorkFlowy`s way to do the same.
// Toggle that class on the document whenever a hotkey is pressed.
// Few key events were passed through to the extension.
// We had the best success with anything using the Meta key.

// create the style
$(`<style>`)
	.text(`
		.show-all-notes .noted > .notes > .content {
			display: block;
			height: auto;
			overflow: visible;
		}`)
	.appendTo(document.head);

// toggle on key press
$(`<button accesskey="n">`)
	.css(`position`, `fixed`)
	.appendTo(document.body).focusin(event => {
		// without focusing the event target the (invisible) button would be in focus
		const selectedNode = event.relatedTarget;
		selectedNode.focus()

		$(document.body).toggleClass(`show-all-notes`);

		// TODO: fix node position
		// expanding all notes moves the content around;
		// to keep the expanded node on screen it would make sense to
		// store the event target's position and restore it later
		// (also see http://stackoverflow.com/a/15154609)

		// preventDefault && stopPropagation
		return false
	})

// add it to shortcut list
afterCommand(`Add a note`).addAccessKey(`Show/hide all notes`, `N`)

//+++++++++++++++++++++//
// STYLE SHORTCUT LIST //
//+++++++++++++++++++++//

$(`<style>`)
	.text(`
		#keyboardShortcutHelper {
			width: 400px;
		}
		#keyboardShortcutHelper td.commandName {
			max-width: 150px;
		}`)
	.appendTo(document.head);


//+++++++++//
// HELPERS //
//+++++++++//

function afterCommand(name) {
	var $commandRow = $(`.shortcutList tr:contains(${name})`)
	return {
		add : function(name, description) {
			afterRowAddNewCommand($commandRow, name, description)
		},
		addAccessKey : function(name, accessKey) {
			afterRowAddNewCommand($commandRow, name, accessKeyText(accessKey))
		}
	}
}

function afterRowAddNewCommand($row, name, description) {
	var newRow = `
		<tr>
			<td class="commandName">${name}</td>
			<td class="commandDescription">${description}</td>
		</tr>`
	$row.after(newRow)
}

function accessKeyText(accessKey) {
	return accessKeyModifier() + ` + ` + accessKey
}

function accessKeyModifier() {
	// TODO: determine shortcut according to browser and OS
	// TODO: memoize
	return `<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey" target="_blank">ACC</a>`
}
