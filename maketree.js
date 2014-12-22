// maketree.js

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
svg = d3.select("#node").append("svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var root = x().stringify();                // place where json is incepted;;; create and IMPORT JSONwith file, 
root.x0 = height/2;
root.y0 = 0;
var zb = d3.behavior.zoom().scaleExtent([0.5,5]).on("zoom", function () {
  zoom();
});
zb.translate([margin.left, margin.top]);
  


// appends string to background or popup page html with ajax
/*
I don't NEED this at this point?
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

$(document).ready(function(){
  console.log(x().stringify());
  createTree();
});
*/
