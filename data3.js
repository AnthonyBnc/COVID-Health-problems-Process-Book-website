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
  var h = 600;
  var padding = 40;

  // Append the svg object to the body of the page
  var svg = d3
    .select("#chart3")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

  // Create scale
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
    .rangeRound([h - padding, padding * 2]);

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
  const bars = svg
    .selectAll(".bar")
    .data(dataset)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${x0(d.REFERENCE_AREA)},0)`)
    .attr("data-country", (d) => d.REFERENCE_AREA)
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
    .attr("data-country", (d, i, nodes) =>
      d3.select(nodes[i].parentNode).attr("data-country")
    )
    .attr("data-year", (d) => d.year);

  // Create title
  svg
    .append("text")
    .attr("x", w / 2)
    .attr("y", padding - 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .attr("font-weight", "bold")
    .text("Unemployment Rate in OECD countries");

  // Create Legend section after the chart is rendered
  createLegendSection(dataset, years);
}

function createLegendSection(dataset, years) {
  const legendSection = d3.select("#legend_section");

  createCountryCheckboxes(legendSection, dataset);
  createYearCheckboxes(legendSection, years);
}

function createCountryCheckboxes(legendSection, dataset) {
  const countryCheckboxes = legendSection
    .append("div")
    .style("display", "inline-block")
    .style("vertical-align", "top")
    .attr("id", "legend_section_country");

  countryCheckboxes.append("strong").text("Countries: ");

  const countryCheckboxGroup = countryCheckboxes.append("div");

  const checkboxes = countryCheckboxGroup
    .selectAll("div")
    .data(dataset)
    .enter()
    .append("div")
    .style("display", "inline-block")
    .style("margin-right", "10px");

  checkboxes
    .append("input")
    .attr("type", "checkbox")
    .attr("checked", true)
    .attr("id", (d) => `checkbox-${d.REFERENCE_AREA}`)
    .on("change", toggleCountry);

  checkboxes
    .append("label")
    .attr("for", (d) => `checkbox-${d.REFERENCE_AREA}`)
    .text((d) => d.REFERENCE_AREA);
}

function createYearCheckboxes(legendSection, years) {
  const yearCheckboxes = legendSection
    .append("div")
    .style("display", "inline-block")
    .style("vertical-align", "top")
    .attr("id", "legend_section_year");

  yearCheckboxes.append("strong").text("Years: ");

  const yearCheckboxGroup = yearCheckboxes.append("div");

  const checkboxes = yearCheckboxGroup
    .selectAll("div")
    .data(years)
    .enter()
    .append("div")
    .style("display", "inline-block")
    .style("margin-right", "10px");

  checkboxes
    .append("input")
    .attr("type", "checkbox")
    .attr("checked", true)
    .attr("id", (d) => `checkbox-${d}`)
    .on("change", toggleYear);

  checkboxes
    .append("label")
    .attr("for", (d) => `checkbox-${d}`)
    .text((d) => d);
}

function toggleCountry() {
  const country = d3.select(this).attr("id").replace("checkbox-", "");
  const isChecked = d3.select(this).property("checked");

  // // Update scale based on visible data
  // updateScale();

  // Apply transition to bars
  d3.selectAll(`.bar[data-country="${country}"]`)
    .transition()
    .duration(500)
    .style("opacity", isChecked ? 1 : 0.01);
}

function toggleYear() {
  const year = d3.select(this).attr("id").replace("checkbox-", "");
  const isChecked = d3.select(this).property("checked");

  // // Update scale based on visible data
  // updateScale();

  // Apply transition to bars
  d3.selectAll(`.bar[data-year="${year}"]`)
    .transition()
    .duration(500)
    .style("opacity", isChecked ? 1 : 0.01);
}

// function updateScale() {
//   // Get the visible data
//   const visibleData = dataset.filter((d) => {
//     const countryCheckbox = d3.select(`#checkbox-${d.REFERENCE_AREA}`);
//     const yearCheckboxes = years.filter((year) => {
//       const yearCheckbox = d3.select(`#checkbox-${year}`);
//       return yearCheckbox.property("checked");
//     });
//     return countryCheckbox.property("checked") && yearCheckboxes.length > 0;
//   });

//   // Recalculate the domain of the y-scale
//   y.domain([
//     0,
//     d3.max(visibleData, (d) =>
//       d3.max(
//         years.filter((year) => {
//           const yearCheckbox = d3.select(`#checkbox-${year}`);
//           return yearCheckbox.property("checked");
//         }),
//         (year) => +d[year]
//       )
//     ),
//   ]).nice();

//   // Update y-axis
//   d3.select(".y.axis").transition().duration(500).call(yAxis);
// }

window.onload = init;
