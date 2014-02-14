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
  x.insert(
  {
    "num":y,
    "tab":tab,
    "tabid":tab.id,
    "fromid":tab.openerTabId,
    "url":tab.url, 
    "title":tab.title,
    "removed":false,
    "marked":false
  }
  );
  // console.log(y + " : " + tab + " : " + tab.id + " : " + tab.openerTabId + " : " + tab.url + " : " + tab.title);
  console.log(x().stringify());
  y++;
});


/** Handle Tab Updates 
  * 
  * Update tab object in database
  **/
chrome.tabs.onUpdated.addListener( function(tab) {
  var tab_record = x({"tabid":tab.id});       // tab to be updated
  tab_record.update({"tab":tab, "url":tab.url, "title":tab.title})
  // console.log(tab.id, tab.url);
});


/** Handle Tab Closing 
  *
  * Marks node in tree as dead
  **/
chrome.tabs.onRemoved.addListener( function(tab.id, {"windowID":tab.windowID, "isWindowClosing":false}) {
  x({"tabid":tab.id}).update({"removed":true});
});
/**/



/** Handle Commands **/
chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
  if (command == "show-tree") {
    var raw_data = x().stringify();
    console.log(raw_data);
    popup = window.open("../browser_action.html");
  } else if (command == "clear-database") {
    x = TAFFY();
    raw_data = {};
    nested_data = {};
  } 
});


function hash(obj) {  

}


/** Create nested d3 data from raw data
  *
  * @param  raw   string
  * @return json  useful data
  **/
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
  for (var ob1 in raw_json_obj) {           // for each element in data
    temp_adj_list.push(ob1.tabid);          // store element, first element in each array in a of a is the root tabs id
    for (var ob2 in raw_json_obj) {         // for each other element in data
      if (ob1.tabid == ob2.fromid && orphan[inner] != false){
                                            // if the other element is a child of the current element and has not been visited
        temp_adj_list.push(ob2.tabid)       // push that unique tab id into its adjacency list
        orphan[inner] = false;              // set the child as taken by a parent; child is no longer orphan
      }
      inner++;
    }
    adj_index[outer] = temp_adj_list;       // place array into outer array spot
    outer++;
    temp_adj_list = [];                     // reset temp array
  }
  /*  Every orphan[x] thats true means it doesnt have 
    After iterating through every pair, I've compared the id of each tab with the fromid 
      of each tab to create an adjacency list (array of arrays)
  */

  var adj = [];
  //waht am idoing her make each adjindex array index:adj_index[0]
  for (var i = 0; i < adj_index.length; i++) {
    adj[adj_index[i][0]] = adj_index;
  }
  adj_index[0]


  raw_json_obj.forEach( function(d) {

  });



  

  /*
  var nest = d3.nest()
    .key( function(d) {
      //write function such that tabid's childrens' values matches openertabid
    })
  */
}


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
  */
function nest() {
  var raw_json_obj = JSON.parse(x().stringify());    // raw array of tab object
  var new_json = {};
  // initialize
  for (var parent in raw_json_obj) {
    // for each tab
    if (parent.fromid == undefined) {  // fix defitnition of <not a number>
      // if the tab has no parent
      mark(parent);                    // implement mark(tab)
      for (var tab2 in raw_json_obj) {
        if (parent.tabid == tab2.fromid) {
          addToParent(new_json, parent, tab2);
          mark(tab2);
        }
      }
    }
  }

  var count = 0;

  // finish up rest
  for (var arbtab in raw_json_obj) {
    while (count != raw_json_obj.length) {
      // count how many tabs have been inserted, stop checking over list until this condition is satisfied
      if (!isMarked(arbtab) && isMarked(getParent(arbtab))) {  
      // implement isMarked(tab)
      // implement getParent(tab)
        // if the current tab hasn't been visited and its parent has, then its a direct link, easy to attach
        addToParent(new_json, getParent(arbtab), arbtab);
      }
    }
  }
}

// marks tab (usually as visited) (generally utilized when creating nest)
function mark(tab) {
  if (!tab.marked)
    tab.marked = true;
  else
    console.log("tab marked ");
}

// checks if tab is marked
function isMarked(tab) {
  return (tab.marked);
}

// gets parent Tab object, returns -1 if there is no tab id
function getParent(tab, raw_json_obj) {
  var from = tab.fromid;
  for (parent in raw_json_obj) {
    if (parent.id == from)
      return parent;
  }
  return -1;
}

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
  */
function addToParent(json, parent, child) {

  var parent_tab = new_json.searchForTabWithID(parent.id);  // implement me

  if (parent_tab != 0)                              // google js und
    parent_tab.children.push(child);
  else
    console.log("Tried to add undefined tab to JSON Tree data structure");

}



















