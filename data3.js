function init() {
  d3.csv("data3.csv").then(function (data) {
    dataset = data;
    var years = data.columns.slice(1);

    createGroupedBarChart(dataset, years);
  });
}

function createGroupedBarChart(dataset, years) {
  // Set the dimensions of the graph
  var w = 800;
  var h = 500;
  var padding = 100;
  var legendWidth = 20;
  var legendHeight = 10;

  // Append the svg object to the body of the page
  var svg = d3
    .select("#chart3")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

  // Create scale
  var color = d3
    .scaleOrdinal()
    .range([
      "#115f9a",
      "#1984c5",
      "#22a7f0",
      "#48b5c4",
      "#76c68f",
      "#a6d75b",
      "#c9e52f",
      "#d0ee11",
      "#d0f400",
    ]);

  var x0 = d3
    .scaleBand()
    .domain(dataset.map((d) => d.REFERENCE_AREA))
    .rangeRound([padding, w - padding])
    .paddingInner(0.1);

  var x1 = d3
    .scaleBand()
    .domain(years)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d3.max(years, (year) => +d[year]))])
    .nice()
    .rangeRound([h - padding, padding]);

  // Create x axis and y axis
  var xAxis = d3.axisBottom(x0);

  var yAxis = d3.axisLeft(y).ticks(10);

  // Append axis to svg
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .attr("text-anchor", "middle")
    .attr("font-size", "6px");

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  // Create bars
  svg
    .selectAll(".bar")
    .data(dataset)
    .enter()
    .append("g")
    .attr("transform", (d) => "translate(" + x0(d.REFERENCE_AREA) + ",0)")
    .selectAll("rect")
    .data((d) => years.map((year) => ({ year, value: +d[year] })))
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x1(d.year))
    .attr("y", (d) => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", (d) => h - padding - y(d.value))
    .attr("fill", (d) => color(d.year));

  // Create title
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", 0 - padding)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("text-decoration", "underline")
    .text("Unemployment Rate, Percentage of labour force");

  // Create legend
  var legend = svg
    .append("g")
    .attr("class", "legend")
    .attr(
      "transform",
      "translate(" + (w - padding - legendWidth) + "," + padding + ")"
    );

  var legendData = years.slice().reverse();

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => i * (legendHeight + 5))
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", color);

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", legendWidth + 10)
    .attr("y", (d, i) => i * (legendHeight + 5) + legendHeight / 2)
    .attr("dy", "0.35em")
    .text((d) => d);
}

window.onload = init;
