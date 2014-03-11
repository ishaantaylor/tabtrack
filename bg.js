// bg.js
/* open database when started */
var x = TAFFY();
var raw_data = {};
var nested_data = {};
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
//  remember to be able to clear database..

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
  var raw_data = {};
  if (command == "show-tree") {
    raw_data = $.parseJSON(x().stringify());              
    console.log(raw_data);
    var nested = nestReal(raw_data);
    console.log("nested json: \n");
    console.log(nested);
    popup = window.open("../browser_action.html");
  } else if (command == "clear-database") {
    console.log("clearing...");
    x().remove(true);
    raw_data = {};
    nested_data = {};
    console.log("successfully cleared");
  } 
});


function hash(obj) {  

}


/** Create nested d3 data from raw data
  *
  * @param  raw   string
  * @return json  useful data
  **
function nestData() {
  var raw_json_obj = JSON.parse(x().stringify());
  console.log(x().stringify());
  var orphan = [];

  
  var adj_index = [];     // array of "linkedlists" adjacency list for tree
  var ain = [];           // 
  var temp_adj_list = []; //          "linkedlist"  adjacency list per element of adj_index
  var outer = 0;
  var inner = 0;

  /*  how to create trees
      we know that if a tab's fromid doesnt match any tabs id, its a root
        so compile list of parents with children 
        parent without children is leaf..array with only one element is a leaf

        sort these in order of db tab insertion order
        place each a[0] value in its own index in a new array. can there be multiples of these? no
        start from beginning and crawl
          base case: if i reach an element by itself
          ie) [
                [1,2,4]
                [2,3,4,5]
                [3]
                [4,5]
                [5]
              ]
              invalid because each child must have exactly one parent.
              fixed:
              [
                [1,2,4]
                [2,3,5]
                [3]
                [4]
                [5]
              ]
  */



/** 
  * Called when user triggers keyboard command
  * Takes raw json tab array and puts it in hierarchy
  *
  * Algorithm:
  *   // initialize
  *   Iterate t each tab object until I find a tab "t" that has no parent O(n)
  *     Mark that tab complete, insert into JSON data structure
  *     search for tabs that have the same fromid as "t"'s tabid O(n)
  *     add to parent ()
  // at this point, each tree will have been started. so build bottom up, find childrens' parents instead of parents' children
  *   Iterate through each tab, seeing if tabs have parents in the structure and then adding them..very time expensive tho
  *     (keep array of tabs that have been added to the json ds) if in here- then proceed to find and add
  * 

// gets parent Tab object, returns -1 if there is no tab id
function getParent(tab, raw_json_obj) {
  var from = tab.fromid;
  for (var parent in raw_json_obj) {
    if (parent.id == from)
      return parent;
  }
  return -1;
}
*/


/**
  * Called by nest() method. Controls inserting an element as a child to a parent.
  * 2 cases
  *   parent doesn't exist
  *   parent is nested
  *
  * in json   Current JSON tree
  * in parent Tab object
  * in child  Tab object
  *
  * out json
  *
function addToParent(json, parent, child) {

  var parent_tab = new_json.searchForTabWithID(parent.id);  // implement me

  if (parent_tab != 0)                              // google js und
    parent_tab.children.push(child);
  else
    console.log("Tried to add undefined tab to JSON Tree data structure");

}
*/


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
}


var json_new = [];
function nestReal(raw) {
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
      json_new = addToParent(json_new, parent, child);          //merge with other file to implement
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