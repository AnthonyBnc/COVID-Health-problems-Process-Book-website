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
  var padding = 40;
  var legendWidth = 10;
  var legendHeight = 10;

  // Append the svg object to the body of the page
  var svg = d3
    .select("#chart3")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

  // Create scale
  var colorLine = d3
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

  var colorChart = d3
    .scaleOrdinal()
    .range([
      "#e60049",
      "#0bb4ff",
      "#50e991",
      "#e6d800",
      "#9b19f5",
      "#ffa300",
      "#dc0ab4",
      "#b3d4ff",
      "#bd7ebe",
      "#00bfa0",
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
    .attr("font-size", "10px")
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em");

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - h / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Percentage of labour force");

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
    .attr("fill", (d) => colorChart(d.year))
    .on("mouseover", function (event, d) {
      var xPosition =
        parseFloat(d3.select(this).attr("x")) + x0.bandwidth() / 2;
      var yPosition = parseFloat(d3.select(this).attr("y")) + padding;

      Bar.append("text")
        .attr("id", "tooltip")
        .attr("x", xPosition)
        .attr("y", yPosition)
        .attr("text-anchor", "middle")
        .attr("font-family", "san-serif")
        .attr("font-size", "20px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(d.value);
    })
    .append("title")
    .text(function (d) {
      return d.value;
    });

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
    .attr("x", -padding)
    .attr("y", (d, i) => i * (legendHeight + 5))
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("fill", colorChart);

  legend
    .selectAll("text")
    .data(legendData)
    .enter()
    .append("text")
    .attr("x", legendWidth - (padding - 2))
    .attr("y", (d, i) => i * (legendHeight + 5) + legendHeight / 2)
    .attr("dy", "0.35em")
    .text((d) => d);

  // Create title
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding - 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .text("Unemployment Rate in OECD countries");

}

window.onload = init;
