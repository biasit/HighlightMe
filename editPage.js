// Undergo edit page after DOM is loaded
window.onload = function() {
	// Add needed classes to the webpage
	var classes = document.createElement('style');
	classes.type = 'text/css';
	classes.innerHTML = '.highlightMe { background-color: yellow;} \
	.boldMe { font-weight: bold; }\
	.underlineMe { text-decoration: underline; }\
	'
	document.getElementsByTagName('head')[0].appendChild(classes);

	var escape = function(string)
	{
		return string.replace("'","\\'");
	}
	var currentURL = window.location.href;

	// If content is stored for url, display it on the page
	if(!(window.localStorage.getItem(currentURL) == null))
	{
	  var currentPossibilities = window.localStorage.getItem(currentURL).split(":ENDWORD:");

		// loop through all of the highlights
	  for(let z = 0; z < currentPossibilities.length-1;z++)
	  {
	    let currentString = currentPossibilities[z];

			// get all of the defining characteristics of this text node
	    var currentText = currentString.split(":WORDS:")[0];
	    var totalSecondValue = currentString.split(":WORDS:")[1];

			var value = totalSecondValue.split(":VALUE:")[0];
	    var totalThirdValue = totalSecondValue.split(":VALUE:")[1];

			var tag = totalThirdValue.split(":LOCATION:")[0];
	    var totalFourthValue = totalThirdValue.split(":LOCATION:")[1];

			var startLocation = totalFourthValue.split(":CHILDNUM:")[0];
	    var totalFifthValue = totalFourthValue.split(":CHILDNUM:")[1];

			var childNumber = totalFifthValue.split(":CLASSNAME:")[0];
			var currClass = totalFifthValue.split(":CLASSNAME:")[1];

			// get the items with the current text
	    let items = $( tag + ":contains(\'" + escape(currentText) + "\')");

			// function for iterating through children of parent

			var currentParent;
	    if(items.length > 0)
	    {
		    if(value != -1)
		    {
		    	currentParent = items[parseInt(value)];
		    } else
		    {
		      currentParent = items[0];
		    }
	    }
			// get the currentnode to be replaced
			let currentNode = currentParent.childNodes[parseInt(childNumber)];

			let innerText = document.createElement("span");
			innerText.className = currClass;
			let startOfInner = startLocation;
			let endOfInner = parseInt(startOfInner) + parseInt(currentText.length);

			if(!(typeof currentNode === undefined))
			{
				let firstText = document.createTextNode(currentNode.textContent.slice(0,startOfInner));

				let inner = document.createTextNode(currentText);
				innerText.append(inner);
				let endText = document.createTextNode(currentNode.textContent.slice(endOfInner));

				// Highlight it
				if(firstText.textContent.length > 0)
				{
					currentNode.parentNode.insertBefore(firstText,currentNode);
				}
				currentNode.parentNode.insertBefore(innerText,currentNode);
				if(endText.textContent.length > 0)
				{
					currentNode.parentNode.insertBefore(endText,currentNode);
				}
				currentNode.parentNode.removeChild(currentNode);
			}
	  }
	}
};
