'use strict';
var $ = require('jquery')

console.log('Hello, WorkFlowy!')

// SHOW ALL NOTES
$('<style>')
	.text(`
		.show-all-notes .noted > .notes > .content {
			display: block;
			height: auto;
			overflow: visible;
		}`)
	.appendTo(document.head);
$(document.body).keypress(event => {
	if (event.keyCode == 78 && event.shiftKey && event.metaKey)
		document.body.classList.toggle('show-all-notes')
})
