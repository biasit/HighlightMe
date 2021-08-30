//Store URL
var currentURL = window.location.href;

//Store state(on or off) and the current class used
var state = false;
if(!(window.localStorage.getItem("currentState") == null))
{
	state = window.localStorage.getItem("currentState");
	state = (state == 'true');
}
var currClass = "highlightMe";
if(!(window.localStorage.getItem("currentClass") == null))
{
	currClass = window.localStorage.getItem("currentClass");
}

//Listen for messages from popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    state = request.state;
		window.localStorage.setItem("currentState",state);

		currClass = request.classNow;
		window.localStorage.setItem("currentClass",currClass);

		//Undergo processing when eraseMe occurrs
		if(currClass === "eraseMe")
		{
			var listOfHighlightNodes = document.getElementsByClassName("highlightMe");
			for(let n = 0; n < listOfHighlightNodes.length;)
			{
				if(!(listOfHighlightNodes[n].parentNode === null))
				{
					var currParent = listOfHighlightNodes[n].parentNode;
					currParent.replaceChild(document.createTextNode(listOfHighlightNodes[n].textContent),listOfHighlightNodes[n]);
					currParent.normalize();
				}
			}
			var listOfUnderlines = document.getElementsByClassName("underlineMe");
			for(let n = 0; n < listOfUnderlines.length;)
			{
				if(!(listOfUnderlines[n].parentNode === null))
				{
					var currParent = listOfUnderlines[n].parentNode;
					currParent.replaceChild(document.createTextNode(listOfUnderlines[n].textContent),listOfUnderlines[n]);
					currParent.parentNode.normalize();
				}
			}
			var listOfBolds = document.getElementsByClassName("boldMe");
			for(let n = 0; n < listOfBolds.length;)
			{
				if(!(listOfBolds[n].parentNode === null))
				{
					var currParent = listOfBolds[n].parentNode;
					currParent.replaceChild(document.createTextNode(listOfBolds[n].textContent),listOfBolds[n]);
					currParent.normalize();
				}
			}
			window.localStorage.removeItem(currentURL);
		}
	}
);

var escape = function(string)
{
	return string.replace("'","\\'");
}
// function for getting the number of the currentParent node our of matching nodes content wise
var getLocation = function(tag,string,node)
{
	var itemsWithText = $( tag + ":contains(\'" + escape(string) + "\')");
	var firstValueToStore = 0;
	for(let i = 0; i < itemsWithText.length; i++)
	{
		if(itemsWithText[i] === node)
		{
			firstValueToStore = i;
			break;
		}
	}
	return firstValueToStore;
}
// function for getting the child number of contentNode of currentParent
var childNumberOfParent = function(node)
{
	var childNumber = 0;
	for(let n = 0; n < node.parentNode.childNodes.length;n++)
	{
		if(node.parentNode.childNodes.item(n) === node)
		{
			childNumber = n;
			break;
		}
	}
	return childNumber;
}
// function for storing new highlights
var storeValues = function(text,firstValue,tag,location,childNumber,currClass)
{
	if(window.localStorage.getItem(currentURL) == null)
	{
		window.localStorage.setItem(currentURL,text+":WORDS:"+firstValue+":VALUE:"+tag+":LOCATION:"+location+":CHILDNUM:"+childNumber+":CLASSNAME:"+currClass+":ENDWORD:");
	} else {
		window.localStorage.setItem(currentURL,window.localStorage.getItem(currentURL)+text+":WORDS:"+firstValue+":VALUE:"+tag+":LOCATION:"+location+":CHILDNUM:"+childNumber+":CLASSNAME:"+currClass+":ENDWORD:");
	}
}
// function to handle when user selects words on the page - undergoes highlighting
document.addEventListener("mouseup", function(){
	// check state and current class
	if(state && !(currClass === "eraseMe"))
	{
		// get and handle the selection
		if(window.getSelection())
		{
			let m = window.getSelection();
			if(m.anchorNode && m.focusNode)
			{
				// make sure focus node is after the anchor node
				if (((m.anchorNode.compareDocumentPosition(m.focusNode) & 4) == 4) || ((m.anchorNode.compareDocumentPosition(m.focusNode) & 16) === 16) || ((m.anchorNode.compareDocumentPosition(m.focusNode) === 0) && (m.anchorOffset < m.focusOffset))){
					// highlight when anchornode and focusnode are the same
					if(m.anchorNode === m.focusNode)
					{
						var possible = document.createElement("span");
						possible.className = currClass;

						var anchorOff = m.anchorOffset;
						var focusOff = m.focusOffset;

						// Get three parts of the text node in order to highlight specific part
						var initialText = document.createTextNode(m.anchorNode.textContent.slice(0,anchorOff));
						var words = document.createTextNode(m.anchorNode.textContent.slice(anchorOff, focusOff));
						possible.appendChild(words);
						var endingText = document.createTextNode(m.anchorNode.textContent.slice(focusOff));

						// Get characteristic number id of node with the text in it
						var tag = m.anchorNode.parentNode.tagName;
						var firstValueToStore = getLocation(tag,words.textContent,m.anchorNode.parentNode);

						// Get number of child of the parent that the current node is
						var childNumber = childNumberOfParent(m.anchorNode);

						// Store the highlighted text and unique values
						storeValues(words.textContent,firstValueToStore,tag,anchorOff,childNumber,currClass);

						// Insert highlighted text into the page
						m.anchorNode.parentNode.insertBefore(initialText,m.anchorNode);
						m.anchorNode.parentNode.insertBefore(possible,m.anchorNode);
						m.anchorNode.parentNode.insertBefore(endingText,m.anchorNode);
						m.anchorNode.parentNode.removeChild(m.anchorNode);

					} else {
						var recursion = function(currentNode, firstChild)
						{
							if(firstChild == false)
							{
								if(currentNode.nextSibling == null)
								{
									if(!(currentNode.parentNode === null))
									{
										// The next sibling doesn't exist, so we should go on to the next sibling of parentNode
										return recursion(currentNode.parentNode, false);
									}
								}
								// Go to next sibling if it isn't the first child of the parentNode
								currentNode = currentNode.nextSibling;
							}
								// condition to see if we are at the end of the selection
								if(currentNode === m.focusNode)
								{
									return;
								}
								// if this has a child, then we should loop through the children
								if(!(currentNode.firstChild === null))
								{
									return recursion(currentNode.firstChild, true);
								}
								// if this is a text node, change highlight the text within
								if(currentNode.nodeType == 3)
								{
									var currentSpan = document.createElement("span");
									currentSpan.className = currClass;
									currentSpan.appendChild(document.createTextNode(currentNode.textContent));

									// Get identifying details
									var tag = currentNode.parentNode.tagName;
									var newerValueToStore = getLocation(tag,currentNode.textContent,currentNode.parentNode);
									var childNumber = childNumberOfParent(currentNode);
									// Store it
									storeValues(currentNode.textContent,newerValueToStore,tag,0,childNumber,currClass);
									// Highlight it
									currentNode.parentNode.replaceChild(currentSpan,currentNode)
									return recursion(currentSpan, false);
								}
						}
						recursion(m.anchorNode, false);

						// Deal with the anchor node

						var possibleOverall = document.createElement("span");
						possibleOverall.className = currClass;
						var words = document.createTextNode(m.anchorNode.textContent.slice(m.anchorOffset));
						possibleOverall.appendChild(words);
						var overallText = document.createTextNode(m.anchorNode.textContent.slice(0,m.anchorOffset));

						var tag = m.anchorNode.parentNode.tagName;
						var newerValueToStore = getLocation(tag,words.textContent,m.anchorNode.parentNode);

						var childNumber = childNumberOfParent(m.anchorNode);
						// Store it
						storeValues(words.textContent,newerValueToStore,tag,m.anchorOffset,childNumber,currClass);
						// Highlight words on the page
						m.anchorNode.parentNode.insertBefore(overallText,m.anchorNode);
						m.anchorNode.parentNode.insertBefore(possibleOverall,m.anchorNode);
						m.anchorNode.parentNode.removeChild(m.anchorNode);

						// Do the same thing for the focus node
						var focusPossible = document.createElement("span");
						focusPossible.className = currClass;
						var focusWords = document.createTextNode(m.focusNode.textContent.slice(0,m.focusOffset));
						focusPossible.appendChild(focusWords);
						var focusOverallText = document.createTextNode(m.focusNode.textContent.slice(m.focusOffset));

						// Get identifying details
						var tag = m.focusNode.parentNode.tagName;
						var firstValueToStore = getLocation(tag,focusWords.textContent,m.focusNode.parentNode);
						var childNumber = childNumberOfParent(m.focusNode);

						// Store it
						storeValues(focusWords.textContent,firstValueToStore,tag,0,childNumber,currClass);
						// Highlight it on page
						m.focusNode.parentNode.insertBefore(focusPossible,m.focusNode);
						m.focusNode.parentNode.insertBefore(focusOverallText,m.focusNode);
						m.focusNode.parentNode.removeChild(m.focusNode);
					}
					m.collapseToStart();
				}
			}
		}
	}
}
);
