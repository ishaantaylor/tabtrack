
//problem statement:
	// given an array of objects, sort those objects into a hierarchy 

// input sets:
	// set where all tabs have predecessors inside the data
	// set where all tabs have predecessors outside the data
	// set where there are undefined predecessors for tabs

// assumptions:
	// every child tab that comes from a parent tab will have a larger id number than its parent **
	//








// comments from other files

//bg.js
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

