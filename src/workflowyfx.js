'use strict';
var $ = require('jquery')

console.log('Hello, WorkFlowy!')

//++++++++++++++++//
// SHOW ALL NOTES //
//++++++++++++++++//

// Create a CSS class that selects all notes and displays their full content
// by mimicking WorkFlowy's way to do the same.
// Toggle that class on the document whenever a hotkey is pressed.
// Few key events were passed through to the extension.
// We had the best success with anything using the Meta key.

// create the style
$('<style>')
	.text(`
		.show-all-notes .noted > .notes > .content {
			display: block;
			height: auto;
			overflow: visible;
		}`)
	.appendTo(document.head);
// toggle on key press
$(document.body).keypress(event => {
	// META + SHIFT + N
	if (event.metaKey && event.shiftKey && event.keyCode == 78)
		document.body.classList.toggle('show-all-notes')
})
// add it to shortcut list
afterCommand('Add a note').add('Show/hide all notes', 'Meta + Shift + N')



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
