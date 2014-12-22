// bg.js
/* open database when started */
var x = TAFFY();
var raw_data = [];
var nested_data = [];

/**
 * Database entry format:
 * {
 *      "rnum":     "record number",
 *      "tab":      tab object,
 *      "tabid":    session unique tab id
 *      "fromid":   id of opener tab
 *      "url":      url of tab
 *      "title":    tab page title
 *      "marked":   boolean
 *      "children": array of children for d3 specs
 * }
 * 
 */

/** Insert all raw tab info to database **/
var y = 0;
console.log("started");


/** Handle Tab Creation
  *
  * Inserts into database 
  **/
chrome.tabs.onCreated.addListener( function(tab) {
  // while (tab.status == "loading") {}   // make sure tab is loaded
  var obj = {
    "num":y,
    "tab":tab,
    "tabid":tab.id,
    "fromid":tab.openerTabId,
    "url":tab.url, 
    "title":tab.title,
    "removed":false,
    "marked":false,
    "children": []
  };
  x.insert(obj);
  // console.log(y + " : " + tab + " : " + tab.id + " : " + tab.openerTabId + " : " + tab.url + " : " + tab.title);
//  console.log(x().stringify());
  y++;
});


/** Handle Tab Updates 
  * 
  * Update tab object in database
  **/
chrome.tabs.onUpdated.addListener( function(tab) {
  var tab_record = x({"tabid":tab.id});       // tab to be updated
  tab_record.update({
      "tab":tab,
      "url":tab.url,
      "title":tab.title
    });
  // console.log(tab.id, tab.url);
});
 

/** Handle Tab Closing 
  *
  * Marks node in tree as dead
  **/
chrome.tabs.onRemoved.addListener( function( tab /*, {"windowID":tab.windowID, "isWindowClosing":false} */) {
  x({"tabid":tab.id}).update({"removed":true});
});
/**/


/** Handle Commands **/
chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
  var raw_data = [];
  console.log(raw_data);
  if (command == "show-tree") {
    raw_data = $.parseJSON(x().stringify());    
    console.log("raw_data: ");          
    console.log(raw_data);
    
    nest(raw_data);     // keep in mind i'm destroying the raw data, fix_later
    console.log("nested json: ");
    console.log(nested_data);
    
    popup = window.open("../browser_action.html");
  } else if (command == "clear-database") {
    console.log("clearing...");
    x().remove(true);
    raw_data = [];
    nested_data = [];
    console.log("successfully cleared");
  } 
});


function hash(obj) {  

}



var items = [];
function Queue() {
  // var items = [];

  Queue.prototype.pushh = function (item) {
    console.log("pushing " + item);
    items.push(item);
    // console.log("printing push result: " + this.printt());
  };

  Queue.prototype.popp = function () {
    if (this.peekk() !== undefined) {
      // console.log("pop: " + this.printt());
      var ret = items.shift();
      console.log("popping " + ret);
      return ret;
    } else {
      // console.log("pop: " + this.printt());
      return undefined;
    }
  };

  Queue.prototype.peekk = function () {
    if (items[0] !== undefined) {
      // console.log("peek: " + items[0]);
      console.log("peek :" + items[0]);
      return items[0];
    } else {
      console.log("nothing to peek");
      return undefined;
    }
  };

  Queue.prototype.printt = function () {
    if (this.peekk() !== undefined) {
      console.log("printing " + items.length + " items in queue: \n{");
      for (var i in items) {
        console.log(items[i]);
      }
      console.log("}");
    } else {
      console.log("items are undefined");
    }
  };

  Queue.prototype.isEmpty = function () {
    return (this.peekk() === undefined);
  }
}


function getID(tab) {
  return tab.tabid;
}


function makeSortedTabIDarray(json) {
  var ids = [];
  for (var i in json) {
    ids.push(json[i].tabid);
  }
  // ids = ids.sort();      // seems like arrays are already sorted
  return ids;
}


function isIn(integer, array) {
  if (integer === undefined)
    return false;
  if (array === undefined)
    return false;
  return (integer in array);
}


// some users will press ctrl+t when on tab A, creating new tree with root tab B. this wont work because ctrl+t doesnt make the tab undefined
/// thus, what I need to do is attach a boolean property called "root" to each tab. if true, initially push into json, else..dont
function nest(raw) {
  // pre processing
  // var a = [];   // array that shows all open tabs
  var b = [];   // array that contains all tabs that will be in the forest
  // var c = [];   // array that contains the intersect of a and b
  var d = [];   // sorted array of all tabs' ids
  //nested_data = [];   // array that holds nested json data

  // a = getAllOpenTabs(); 
  b = raw;
  // c = intersect(a,b);
  d = makeSortedTabIDarray(raw);

  for (var i in raw) {
    if (!isIn(b[i].fromid,d)) {     // if tab fromid is NOT in d(forest ids) 
      nested_data.push(b[i]);              //  then push it
    }
  }

  for (var j in nested_data) {
    addChildren(nested_data[j]);
  }
}


// find tabs in db such that {fromid:tab.tabid}
// query if there are any tabs such that their fromid is this tabs id
function addChildren(tab) {
  if (tab === undefined || tab.tabid === undefined)
    return;
  var childs = x({fromid:{is:tab.tabid}});    
  var json_children = $.parseJSON(childs.stringify()); 
  
  // updatecurrent tab with those children
  tab.children = json_children;

  // for each of those children, add children
  for (var k in json_children) {
    addChildren(childs[k]);
  }
}
