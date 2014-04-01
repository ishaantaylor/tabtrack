// 4/1/12
  // big progress. got nested json to work, got something to show up on the extension.
  // todo
      // write my own version of the d3 tree implementation, my own styles etc.
        // figure out how to hover over tree node and display info
        // zoomable, in and out
        // clean nice interface (make use of mouse hover -> information)
        // obviously collapse and expand
        //keep adding...etc
      // find way to get name of page into database
      // figure out how to export the nested json into a file!



// simple algorithm
	// query each tabs parent as its created and push it into the children array... shit then i have to figure out how to query for infinitely leveled children... this isnt that simlpe unfortunately.
	// i have a method that can traverse every object from top to bottom of a json object.. hopefully it works? ill test it on fiddle







// 3/23/14 - this doesnt seem to be getting accomplished, 
//// deciding its better to have a really simple, possibly really inefficient solution rather than not having a solution at all.
//// once i get the simple solution working (implying the entire datapath will work as well) then i'll improve the algo
// lol cant make up my mind. will step away from this until tomorrow. this algo may be the best one.. just have to make it work!
//problem statement:
	// given an array of objects, sort those objects into a hierarchy 
	//

// input sets:
	// set where all tabs have predecessors inside the data
	// set where all tabs have predecessors outside the data
	// set where there are undefined predecessors for tabs

// assumptions:
	// every child tab that comes from a parent tab will have a larger id number than its parent **
	//

// solution
	// pre processing: catch all tabs that fromid are in array C (meaning they are the predecessors for roots of their trees)
		// array A will be the array that shows all open tabs 
			// (possible bug: could have new tabs generated with a fromid of a closed tab by the time data is collected..but i think its fine)
		// array B will be the array that contains all tabs in the forest
		// figure out which tabs are in A but not in B -- put it into a third array C
			// sort them and then run a linear comparison  
				// since both arrays are non-decrasing, (use smaller array as reference) i can eliminate tabs that 
				// are less than the current reference value
	// algo
		// do the pre processing
		// 3 cases for roots
			// catch all fromid:undefined tabs, push into json
			// compare the fromid of remaining tabs, push into json if predecessor appears in array C
			// compare the fromid of remaining tabs, push into json if predecessor !appear in array B
		// up until now, every tab in the json cannot be a child (theyre roots)
		// with each tab
			// pull from database all tabs that have a fromid of current tab
				
			// attach these tabs / push them into json children

			// (this eliminates having to search for tabs as well if we just make the function recursively ...
			// for each child that we just added
				// traversing the json and performing this action for each)









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

