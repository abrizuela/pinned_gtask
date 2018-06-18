let currentTabId;
let taskTabId;
let previousTab;

function onError(e) {
  console.log("***Error: " + e);
};

function createPinnedTab() {
  browser.tabs.create(
    {
      url: "https://mail.google.com/tasks/canvas",
      pinned: true,
      active: true
    }
  )
};

function handleSearch(taskTabs) {
  //console.log("currentTabId: " + currentTabId);
  if(taskTabs.length > 0) {
    //console.log("there is a task tab");
    taskTabId = taskTabs[0].id;
    if(taskTabId === currentTabId) {
      //console.log("I'm in the task tab");
      browser.tabs.update(previousTab, {active: true,});
    } else {
      //console.log("I'm NOT in the task tab");
      previousTab = currentTabId;
      browser.tabs.update(taskTabId, {active: true,});
    }
  } else {
    //console.log("there is NO task tab");
    previousTab = currentTabId;
    createPinnedTab();
  }
};

function handleClick(tab) {
  //console.log("*********Button clicked*********");
  currentTabId = tab.id;
  var querying = browser.tabs.query({url: "*://mail.google.com/tasks/canvas*"});
  querying.then(handleSearch, onError);
};

function update(details) {
  if (details.reason === "install" || details.reason === "update") {
    var opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);  }
};

browser.browserAction.onClicked.addListener(handleClick);
browser.runtime.onInstalled.addListener(update);