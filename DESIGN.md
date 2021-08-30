Let me walk you through each of the files of my project.

Manifest.json
The manifest file sets up the inherent structure and components of a chrome extension.
This is where my javascript files are integrated as content scripts and my
popup is included.

Popup.html
This is the html code for the popup that appears when the marker icon in the upper
right hand corner is clicked.

Popup.js
This is javascript that runs inside of popup.html. This ensures that the buttons
appear to be pressed at the correct moments by using a combination of booleans
with local storage. When a button is pressed, it also sends a message using
chrome.tabs.sendMessage to the highlight.js script in order to tell it whether
to highlight, bold, or underline, and to tell it when to be on or off.

Highlight.js
This is the code for highlighting the webpage. The script first receives
messages from popup.js in order to know what CSS class(highlight, bold, or underline)
to use and whether it should be working at that moment. It also handles erasing the
highlights and underlines from a page by finding all of them and then removing them
from the page (and from storage).

Highlight.js then undergoes some complex code to highlight words on the webpage and
store the words. I learned just the other day that there was a different method of accomplishing this that was much much simpler, but the method I'm using is a method I figured
out on my own. Essentially, when the user makes a selection on the page (with the mouse),
Highlight.js loops through every single node within that selection and replaces
the node's text content with a span element that has the highlight, bold, or underline
css class and the text content. Some of the initial code is oriented towards if the
selection is within a singular node (m.anchorNode === m.focusNode).
This looping through the nodes has to occur because selection may include nodes from
many different elements on a page that can't necessarily be put in a single
span object with the highlight/bold/underline class.
For storage, I used the Web Storage API. All of my highlights for a single webpage
are stored in a string which is the value to a key in storage (which is the webpage's URL).
The reason I decided to do this (instead of using cookies for example) was because
it seemed like the easiest method programmatically to store my highlights. Now,
I will admit that it may not be the best design (I have to constantly reformat
a string for storage), but I found cookies to be quite challenging, and this method
gave me a clear cut way to store my highlights. When I store the text that has been
highlighted, I also store indicators that uniquely identify the parent node
of the text content along with the location of the text content within its
parent node.

Editpage.js
Editpage.js is what inserts my unique CSS classes into the webpage.
Editpage.js also takes the stored highlighted text and highlights the relevant
text on the webpage when a website loads. It basically undoes what Highlight.js
did.
