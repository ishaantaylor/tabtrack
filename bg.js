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
  console.log(raw_data);
  if (command == "show-tree") {
    // console.log(x().stringify());
    // raw_data = $.parseJSON(x().stringify());   
    raw_data = [{"num":0,"tab":{"active":false,"height":0,"highlighted":false,"id":1145,"incognito":false,"index":1,"openerTabId":1040,"pinned":false,"selected":true,"status":"loading","title":"New Tab","url":"chrome://newtab/","width":0,"windowId":1039},"tabid":1145,"fromid":1040,"url":"chrome://newtab/","title":"New Tab","removed":false,"marked":false,"children":[],"___id":"T000002R000002","___s":true},{"num":1,"tab":{"active":false,"height":0,"highlighted":false,"id":1150,"incognito":false,"index":2,"openerTabId":1145,"pinned":false,"selected":false,"status":"complete","title":"","url":"","width":0,"windowId":1039},"tabid":1150,"fromid":1145,"url":"","title":"","removed":false,"marked":false,"children":[],"___id":"T000002R000003","___s":true},{"num":2,"tab":{"active":false,"height":0,"highlighted":false,"id":1152,"incognito":false,"index":3,"openerTabId":1145,"pinned":false,"selected":false,"status":"complete","title":"","url":"","width":0,"windowId":1039},"tabid":1152,"fromid":1145,"url":"","title":"","removed":false,"marked":false,"children":[],"___id":"T000002R000004","___s":true},{"num":3,"tab":{"active":false,"height":0,"highlighted":false,"id":1156,"incognito":false,"index":4,"openerTabId":1145,"pinned":false,"selected":false,"status":"complete","title":"","url":"","width":0,"windowId":1039},"tabid":1156,"fromid":1145,"url":"","title":"","removed":false,"marked":false,"children":[],"___id":"T000002R000005","___s":true},{"num":4,"tab":{"active":false,"height":0,"highlighted":false,"id":1162,"incognito":false,"index":3,"openerTabId":1150,"pinned":false,"selected":false,"status":"complete","title":"","url":"","width":0,"windowId":1039},"tabid":1162,"fromid":1150,"url":"","title":"","removed":false,"marked":false,"children":[],"___id":"T000002R000006","___s":true},{"num":5,"tab":{"active":false,"height":0,"highlighted":false,"id":1164,"incognito":false,"index":4,"openerTabId":1150,"pinned":false,"selected":false,"status":"complete","title":"","url":"","width":0,"windowId":1039},"tabid":1164,"fromid":1150,"url":"","title":"","removed":false,"marked":false,"children":[],"___id":"T000002R000007","___s":true},{"num":6,"tab":{"active":false,"height":0,"highlighted":false,"id":1170,"incognito":false,"index":4,"openerTabId":1162,"pinned":false,"selected":false,"status":"complete","title":"","url":"","width":0,"windowId":1039},"tabid":1170,"fromid":1162,"url":"","title":"","removed":false,"marked":false,"children":[],"___id":"T000002R000008","___s":true}];

    console.log("raw_data: ");          
    console.log(raw_data);
    
    nest(raw_data, nested_data);     // keep in mind i'm destroying the raw data, fix_later
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



/*
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
*/


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


/*
function getAllOpenTabs() {
  chrome.tabs.query({}, function(tabs) {
    return tabs;
  });
}
*/

// some users will press ctrl+t when on tab A, creating new tree with root tab B. this wont work because ctrl+t doesnt make the tab undefined
/// thus, what I need to do is attach a boolean property called "root" to each tab. if true, initially push into json, else..dont
function nest(raw, nest) {
  // pre processing
  // var a = [];   // array that shows all open tabs
  var b = [];   // array that contains all tabs that will be in the forest
  // var c = [];   // array that contains the intersect of a and b
  var d = [];   // sorted array of all tabs' ids
  // nest = [];   // array that holds nested json data

  // a = getAllOpenTabs(); 
  b = raw;
  // c = intersect(a,b);
  d = makeSortedTabIDarray(b);

  for (var i in raw) {            // this seems to be a problem
    var valid = !isIn(b[i].fromid,d);   // if tab fromid is NOT in d(forest ids)  
    var valid2 = (b[i].fromid in d);
    console.log("b[i]: " + b[i].fromid);
    console.log("d: " + d);
    console.log(valid2);
    if (valid) {     
      nest.push(b[i]);                  //  then push it
    }
  }

  //
  // recursive part
  for (var j in nest) {
    addChildren(nest[j]);
  }
}


// find tabs in db such that {fromid:tab.tabid}
// query if there are any tabs such that their fromid is this tabs id
function addChildren(tab) {
  if (tab === undefined || tab.tabid === undefined)
    return;
  var childs = x({fromid:tab.tabid});    
  // console.log(childs.stringify());    
  var json_children = $.parseJSON(childs.stringify());      // not sure why i have to do this
  // updatecurrent tab with those children
  tab.children = json_children;

  /// for each of those children, call this function again.....
  for (var k in json_children) {
    addChildren(json_children[k]);
  }
}


/* takes in current json, parent tab and child tab - edits the tab object (which automatically edits json)
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
*/