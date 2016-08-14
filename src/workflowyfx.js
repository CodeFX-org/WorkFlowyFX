'use strict';

console.log('Hello, WorkFlowy!')

// SHOW ALL NOTES

 /* TODO
  *  - jQuery
  *  - more sensible key code (?)
  */

const style = document.createElement('style')
style.innerHTML = `
    .show-all-notes .noted > .notes > .content {
      display: block;
      height: auto;
      overflow: visible;
    }`

// $(style).appendTo(document.head)
document.head.appendChild(style)

//$(document.body).keypress(event => {
//    if (event.keyCode == 13 && event.ctrlKey && event.shiftKey)
//        $(document.body).toggleClass('show-all-notes')
//})
document.body.addEventListener('keypress', event => {
    if (event.keyCode == 78 && event.shiftKey && event.metaKey)
        document.body.classList.toggle('show-all-notes')
})
