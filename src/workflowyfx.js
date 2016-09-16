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
$(document.body).keypress(event => {
	// META + SHIFT + N ~> show all notes
	if (isMetaPressed(event) && event.shiftKey && event.key == `N`) {
		document.body.classList.toggle(`show-all-notes`)
		event.preventDefault()
	}
})
function isMetaPressed(event) {
	// Firefox does not seem to register the meta key
	// (see http://stackoverflow.com/questions/39292111/can-firefox-detect-metakey),
	// so we allow both Meta (for Chrome) and Alt (for Firefox)
	return (event.metaKey || event.altKey);
}
// add it to shortcut list
afterCommand(`Add a note`).add(`Show/hide all notes`, `Meta + Shift + N`)

//+++++++++++++++++++++//
// STYLE SHORTCUT LIST //
//+++++++++++++++++++++//

$(`<style>`)
	.text(`
		#keyboardShortcutHelper {
			width: 375px;
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
