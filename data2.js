// Define the dataset
var dataSet = [
  { year: 2019, billions: 175 },
  { year: 2020, billions: 216 },
  { year: 2021, billions: 268 },
  { year: 2022, billions: 334 },
  { year: 2023, billions: 417 },
  { year: 2024, billions: 523 },
];

// Create the bar chart function
function createBarChart(dataSet) {
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
    .scaleBand()
    .domain(
      dataSet.map(function (d) {
        return d.year;
      })
    )
    .range([padding, w - padding])
    .padding(0.1);

  var yScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataSet, function (d) {
        return d.billions;
      }),
    ])
    .range([h - padding, padding]);

  // Create bars with tooltips, transitions, and data point labels
  svg
    .selectAll("rect")
    .data(dataSet)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xScale(d.year);
    })
    .attr("y", function (d) {
      return yScale(d.billions);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return h - padding - yScale(d.billions);
    })
    .style("fill", "steelblue")
    .on("mouseover", function (event, d) {
      d3.select(this).transition().duration(100).style("fill", "orange");
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
      d3.select(this).transition().duration(600).style("fill", "steelblue");
      d3.select("#tooltip").style("opacity", 0);
    })
    .transition()
    .delay(function (d, i) {
      return i * 100;
    })
    .duration(500)
    .attr("y", function (d) {
      return yScale(d.billions);
    });

  // Create x-axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(d3.axisBottom(xScale));

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

// Call the createBarChart function with the new dataset
createBarChart(dataSet);
