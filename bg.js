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
    "children": {}
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
  tab_record.update({"tab":tab, "url":tab.url, "title":tab.title});
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
  if (command == "show-tree") {
    raw_data = $.parseJSON(x().stringify());              
    console.log(raw_data);
    /*
    var nested = nestReal(raw_data);
    console.log("nested json: \n");
    console.log(nested);
    */
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


var json_new = [];
function nestReal(raw) {
  json_new.push({"name":"root", "children":[] });  
  var count = 0;
  var q = new Queue();
  // var json_new = [];

  console.log("size of raw array: " + raw.length);
  // initialize queue
  for (var i in raw) {
    var tab = raw[i]
    console.log("tab: \n\t");
    console.log(tab);
    if (tab.fromid === undefined) {       //figure out if we use -1 or underfined
      console.log("initial: " + tab);             // print initialized tab titles
      q.pushh(tab);
      count++;                            // increment count to know where i'm at
    } 
  }

  if (q.isEmpty()) {

  }

  // gonna need to handle the case that the initial queueeing wont yeild things 
      // because certian tabs arent undefined.. 
      // that means that not all initial tabs in this tree will lead to an undefined tab. 
          // that means taht i need to be able to tell if a tab is a parent or a child (or both ) 
            //.. if a tab isnt a child, then it must be a praent. so I need to write in my algorithm: 
              // assume the tab is a child until proven its not (until i cant find it in the tree or the raw data)
  // could create a sorted array for this, but then it would take O(n) to insert and O(log n) to search (bst).


  console.log(q.printt()); 
  while (count < raw.length && q.peekk() !== undefined) {               // could also do while queue is not empty maybe
    console.log("count: " + count);
    var parent = q.popp();                            // get first tab in queue
    console.log("parent: " + parent);
    if (parent.fromid === undefined)
      json_new = addToParent(json_new, parent, undefined);    //implement cases for both nodes without parent and with 
    var children = x({"fromid": {is:parent.id}});     // get children of parent from db
    for (var j in children) {                     // for each child to the original parent
      var child = children[j];
      console.log("child: " + child);
      q.pushh(child);                                   // add children to queue
      count++;                                          // increment count to know where i'm at
      json_new = addToParent(json_new, parent, child);          
    }
  }
  console.log(json_new.toString());
  return json_new;
}


// takes in current json, parent tab and child tab - edits the tab object (which automatically edits json)
function addToParent(json, parent, child) {
  if (child === undefined) {
    json.push(parent);
  } else {
    var parent_tab = searchForTabWithID(json, parent.id);  // implement me
    var child_tab  = searchForTabWithID(json, child.id);
    if (parent_tab !== undefined)                           
      parent_tab.children.push(child_tab);
  }
  return json;
}


// returns tab object found to function addToParent()
function searchForTabWithID(obj, id) {
  if (id === undefined)            // if tab id doesnt exist, return undefined
    return undefined;

  if (obj.id == id)                // if tab is the object, return it
    return obj; 

  
  for (var j in obj.children) {
    if (obj.children[j].id == id)  // if the id of the field is the correct id (fix bug)
      return obj;
  }

  // if the immediate children don't return anything, check the childrens' children.
  for (var j in obj.children) {
    if (typeof(obj[i]) == "object")
        searchForTabWithID(obj.children[j], id);
                                  // recurse
  }
}