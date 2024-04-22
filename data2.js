// Define the dataset
var dataSet = [
  { year: 2019, billions: 175 },
  { year: 2020, billions: 216 },
  { year: 2021, billions: 268 },
  { year: 2022, billions: 334 },
  { year: 2023, billions: 417 },
  { year: 2024, billions: 523 },
];

// Create the line chart function
function createLineChart(dataSet) {
  // Define SVG dimensions and padding
  var w = 800;
  var h = 500;
  var padding = 40;

  // Create SVG element
  var svg = d3
    .select("#chartd1")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Define scales
  var xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataSet, function (d) {
        return d.year;
      }),
      d3.max(dataSet, function (d) {
        return d.year;
      }),
    ])
    .range([padding, w - padding]);

  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataSet, function (d) {
        return d.billions;
      }),
    ])
    .range([h - padding, padding]);

  // Define the line function
  var line = d3
    .line()
    .x(function (d) {
      return xScale(d.year);
    })
    .y(function (d) {
      return yScale(d.billions);
    });

  // Append the line to the SVG
  svg
    .append("path")
    .datum(dataSet)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Create circles for data points
  svg
    .selectAll("circle")
    .data(dataSet)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.year);
    })
    .attr("cy", function (d) {
      return yScale(d.billions);
    })
    .attr("r", 5)
    .attr("fill", "steelblue")
    .on("mouseover", function (event, d) {
      d3.select(this).attr("r", 8).attr("fill", "orange");
      var tooltip = d3.select("#tooltip");
      tooltip
        .style("opacity", 1)
        .html(
          "Year: " +
            d.year +
            "<br>Digital health Spent: " +
            d.billions +
            " Billions"
        );
    })
    .on("mouseout", function () {
      d3.select(this).attr("r", 5).attr("fill", "steelblue");
      d3.select("#tooltip").style("opacity", 0);
    });

  // Create x-axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(
      d3.axisBottom(xScale).ticks(dataSet.length).tickFormat(d3.format("d"))
    );

  // Create y-axis
  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(d3.axisLeft(yScale));

  // Add chart title
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .text("Digital Health Expenditure");

  // Add tooltip element
  d3.select("#chartd1").append("div").attr("id", "tooltip").style("opacity", 0);
}

// Call the createLineChart function with the dataset
createLineChart(dataSet);
