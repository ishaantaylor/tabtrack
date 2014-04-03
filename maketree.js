// maketree.js

/* change in plans. just track historyt until user wants to see tree constructed by pressing icon
must:
    keep updated list of tabs and    */
    
    
// background script will query database to create tree when user clicks icon or whatever


// var on = false;



/* makes extension active or inactive with click of icon
chrome.browserAction.onClicked.addListener( function(tab) {
  on = !on;   // turn it "on" or "off"
  if (on) {   // check if it's already on
    window.console.log("on");
    //initialize tree if new tab
    var tree = createTree(tab);
    chrome.tabs.onCreated.addListener( function(tab) {
      window.console.log(tab.id + ":"+ tab.url +":" + tab.openerTabId);
      if (tab.openerTabId !== null) {            //call function to add node to tree
      } else if (tab.openerTabId === null) {     //or start new tree
        
      }
    });
    chrome.tabs.onUpdated.addListener( function(tab) {
      //call function to update info for existing node in tree
    });
  } else {
    
    //remove all listeners ive added
    chrome.tabs.onCreated.removeListener( function() {
      //whatever i wanna do..export the tree json maybe?
    });
    window.console.log("off");
  }
});
*/

function collapse(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(collapse);
    d.children = null;
  }
}

function expand(d) {
    if (d._children && d.depth < 4) {
        d.children = d._children;
        d._children.forEach(expand);
        d._children = null;
    } else if (d.depth >= 4) {
      //write function to double tree height
    }
}


function listTabs() {
  var fourmTabs = [];
  chrome.tabs.query({}, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
          fourmTabs[i] = tabs[i];
      }
      // Moved code inside the callback handler
      for (var j = 0; j < fourmTabs.length; j++) {
          if (fourmTabs[j] !== null) { 
              window.console.log(j + "," + fourmTabs[j].id + ", " + fourmTabs[j].url + ", " + fourmTabs[j].openerTabId);
              // apend(fourmTabs[j].id + ", " + fourmTabs[j].url);
              
          } else {
              window.console.log("??, " + j);
          }
      }
  });
}


var diameter = 960;
var margin = {
  top: 20,
  right: 80,
  bottom: 20,
  left: 80
},
width = 960 - margin.right - margin.left,
height = 800 - margin.top - margin.bottom;
var tree = d3.layout.tree()
  .size([height, width]);
  /*
  .separation(function(a,b){
    return (a.parent == b.parent ? 1 : 2) / a.depth;
  });
  */
var diagonal = d3.svg.diagonal()
  .projection(function (d) {
    return [d.y, d.x];
  });
svg = d3.select("#tree").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var root = nested_data;                // place where json is incepted;;; create and IMPORT JSONwith file, 
root.x0 = height/2;
root.y0 = 0;
var zb = d3.behavior.zoom().scaleExtent([0.5,5]).on("zoom", function () {
  zoom();
});
zb.translate([margin.left, margin.top]);
  


// appends string to background or popup page html with ajax
/*
I don't NEED this.. so why have it at this point?
function apend(string) {
    window.console.log(string);
    $("container").append("<p>"+string+"</p>\n");
}
*/

/*
Create tab listener, 
on create new tab from any source, 3 cases
  tab with no parent
  tab from existing tab
  
  $(function) (once the page is ready), 
    store info in database
    use data to create tree node in (2 cases) proper place
      new tree - no parent
      same tree - under parent
*/

/*
Must create
*

$(document).ready(function(){
  console.log(x().stringify());
  createTree();
});
*/
