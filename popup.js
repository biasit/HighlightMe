// get the buttons
var highlightButton = document.getElementById("highlight");
var boldButton = document.getElementById("bold");
var underlineButton = document.getElementById("underline");
var eraseButton = document.getElementById("erase");

// variables
var highlightOn = "background: url(images/icon_32.png); box-shadow:inset 0 0 1em black;";
var highlightOff = "background: url(images/icon_32.png);";
var boldOff = "font-size: 20px; font-weight: bold; background-color: white;";
var boldOn = "font-size: 20px; font-weight: bold; background-color: white; box-shadow:inset 0 0 1em black;";
var underlineOff = "font-size: 20px; text-decoration: underline; background-color: white;";
var underlineOn = "font-size: 20px; text-decoration: underline; background-color: white; box-shadow:inset 0 0 1em black;";


// Set initial values of each of the button's styles - store them as well
var currentState = false;
var initialValue = "highlightMe";
if(window.localStorage.getItem("highlightOn") == null)
{
    window.localStorage.setItem("highlightOn",currentState);
} else {
    currentState = window.localStorage.getItem("highlightOn");
    currentState = (currentState == 'true');
    if(currentState == true)
    {
      highlightButton.style = highlightOn;
    } else {
      highlightButton.style = highlightOff;
    }
}
var currentBoldState = false;
if(window.localStorage.getItem("boldOn") == null)
{
    window.localStorage.setItem("boldOn",currentBoldState);
} else {
    currentBoldState = window.localStorage.getItem("boldOn");
    currentBoldState = (currentBoldState == 'true');
    if(currentBoldState == false)
    {
      boldButton.style = boldOff;
    } else {
      boldButton.style = boldOn;
      initialValue = "boldMe";
    }
}
var currentUnderlineState = false;
if(window.localStorage.getItem("underOn") == null)
{
    window.localStorage.setItem("underOn",currentUnderlineState);
} else {
    currentUnderlineState = window.localStorage.getItem("underOn");
    currentUnderlineState = (currentUnderlineState == 'true');
    if(currentUnderlineState == false)
    {
      underlineButton.style = underlineOff;
    } else {
      underlineButton.style = underlineOn;
      initialValue = "underlineMe";
    }
}
// send the current state to highlight.js
var correctState = (currentUnderlineState || currentBoldState || currentState);
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
chrome.tabs.sendMessage(tabs[0].id, {state: correctState,classNow: initialValue}, function(response) {
});
});

highlightButton.onclick = function(element)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  if(currentState == true)
  {
    currentState = false;
    highlightButton.style = highlightOff;
  } else {
    currentState = true;
    highlightButton.style = highlightOn;
    underlineButton.style = underlineOff;
    window.localStorage.setItem("underOn",false);
    boldButton.style = boldOff;
    window.localStorage.setItem("boldOn",false);
  }
  window.localStorage.setItem("highlightOn",currentState);
  chrome.tabs.sendMessage(tabs[0].id, {state: currentState,classNow: "highlightMe"}, function(response) {
  });
});
}
boldButton.onclick = function(element)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(currentBoldState == true)
    {
      currentBoldState = false;
      boldButton.style = boldOff;
    } else {
      currentBoldState = true;
      boldButton.style = boldOn;
      highlightButton.style = highlightOff;
      window.localStorage.setItem("highlightOn",false);
      underlineButton.style = underlineOff;
      window.localStorage.setItem("underOn",false);
    }
    window.localStorage.setItem("boldOn",currentBoldState);
    chrome.tabs.sendMessage(tabs[0].id, {state: currentBoldState,classNow: "boldMe"}, function(response) {

  });
});
}

underlineButton.onclick = function(element)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(currentUnderlineState == true)
    {
      currentUnderlineState = false;
      underlineButton.style = underlineOff;
    } else {
      currentUnderlineState = true;
      underlineButton.style = underlineOn;
      highlightButton.style = highlightOff;
      window.localStorage.setItem("highlightOn",false);
      boldButton.style = boldOff;
      window.localStorage.setItem("boldOn",false);
    }
    window.localStorage.setItem("underOn",currentUnderlineState);
    chrome.tabs.sendMessage(tabs[0].id, {state: currentUnderlineState,classNow: "underlineMe"}, function(response) {
  });
}
);
}
// Handle erase button pressed
eraseButton.onclick = function(element)
{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    highlightButton.style = highlightOff;
    window.localStorage.setItem("highlightOn",false);
    boldButton.style = boldOff;
    window.localStorage.setItem("boldOn",false);
    underlineButton.style = underlineOff;
    window.localStorage.setItem("underOn",false);
    chrome.tabs.sendMessage(tabs[0].id, {state: false,classNow: "eraseMe"}, function(response) {
  });
}
);
}
