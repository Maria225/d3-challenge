//set height, width, and margins
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity"

// function used for updating x-scale var upon click on axis label
function xScale(HRdata, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(HRdata, d => d[chosenXAxis]) * 0.8,
      d3.max(HRdata, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);
  return xLinearScale;
};

function yScale(HRdata, chosenYAxis) {
 // create scales
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(HRdata, d => +d[chosenYAxis]) * 0.85,
    d3.max(HRdata, d => +d[chosenYAxis]) * 1.1])
    .range([height, 0]);
  return yLinearScale;
};

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(HRdata) {  
  //console.log(HRdata);
    
  // parse data
  HRdata.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
    data.smokes = +data.smokes;
  });

// xLinearScale and yLInear scale function 
var xLinearScale = xScale(HRdata, chosenXAxis);
var yLinearScale = yScale(HRdata, chosenYAxis);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);


// append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
var yAxis = chartGroup.append("g")
  .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(HRdata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "lightblue");
         
  var textsGroup = chartGroup.selectAll("text")
     .data(HRdata).enter().append("text")
     .attr("font-size", "10px")
     .attr("x", d => xLinearScale(d[chosenXAxis]))
     .attr("y", d => yLinearScale(d[chosenYAxis])+3)
     .attr("class", "stateText")
     .text(d => d["abbr"]);  
 
 
  // Create group for  3 x - axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Proverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");  

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");


 // Create group for  3 y - axis labels
 var ylabelsGroup = chartGroup.append("g")
 .attr("transform", "rotate(-90)");

var obeseLabel = ylabelsGroup.append("text")
 .attr("x", 0 - (height / 2))
 .attr("y", 0 - margin.left + 20)
 .attr("value", "obesity") // value to grab for event listener
 .classed("active", true)
 .text("Obese (%)");

var smokesLabel = ylabelsGroup.append("text")
 .attr("x", 0 - (height / 2))
 .attr("y", 0 - margin.left + 40)
 .attr("value", "smokes") // value to grab for event listener
 .classed("inactive", true)
 .text("Smokes (%)");  

var healthcareLabel = ylabelsGroup.append("text")
.attr("x", 0 - (height / 2))
.attr("y", 0 - margin.left + 60)
.attr("value", "healthcare") // value to grab for event listener
.classed("inactive", true)
.text("No Healthcare (%)"); 


//clicking on the x-axis
xlabelsGroup.selectAll("text").on("click", function() {
var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {
    chosenXAxis = value;
    xLinearScale = xScale(HRdata, chosenXAxis);
    var newXaxis = d3.axisBottom(xLinearScale);
    xAxis.transition().duration(500).call(newXaxis);
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => xLinearScale(d[chosenXAxis]));
    textsGroup.transition().duration(1000)
    .attr("x", d => xLinearScale(d[chosenXAxis]));  

  if (chosenXAxis === "age") {
    povertyLabel
      .classed("active", false)
      .classed("inactive", true);
    ageLabel
      .classed("active", true)
      .classed("inactive", false);
    incomeLabel
      .classed("active", false)
      .classed("inactive", true);
  }
  else if (chosenXAxis === "poverty") {
    povertyLabel
      .classed("active", true)
      .classed("inactive", false);
    ageLabel
      .classed("active", false)
      .classed("inactive", true);
    incomeLabel
      .classed("active", false)
      .classed("inactive", true);
  }
  else {
    povertyLabel
      .classed("active", false)
      .classed("inactive", true);
    ageLabel
      .classed("active", false)
      .classed("inactive", true);
    incomeLabel
      .classed("active", true)
      .classed("inactive", false);
  }
  console.log(chosenXAxis);
}
});

//clicking on the y-axis
ylabelsGroup.selectAll("text").on("click", function() {
  var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
      chosenYAxis = value;
      yLinearScale = yScale(HRdata, chosenYAxis); 
      var newYaxis = d3.axisLeft(yLinearScale);
      yAxis.transition().duration(500).call(newYaxis);
      circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => yLinearScale(d[chosenYAxis]));
      textsGroup.transition().duration(1000)
      .attr("y", d => yLinearScale(d[chosenYAxis])+3);
    
    if (chosenYAxis === "smokes") {
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    } 
    else if (chosenYAxis === "obesity") {
      obeseLabel
        .classed("active", true)
        .classed("inactive", false);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      obeseLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  console.log(chosenYAxis);
  }
});

}).catch(function(error) {
  console.log(error);
});