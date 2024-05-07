// Load the CSV data
d3.csv("Book1.csv").then(function (data) {
  // Parse the data
  data.forEach(function (d) {
    d["2019"] = parseFloat(d["2019"]);
    d["2020"] = parseFloat(d["2020"]);
  });

  // Render the initial bar chart
  barChart(data, "2020"); // Change the initial year to 2020

  // Add event listener to year slider
  d3.select("#year-slider").on("input", function () {
    // Get the selected year
    var selectedYear = this.value;
    // Update the bar chart
    barChart(data, selectedYear);
  });

  // Bar chart function
  function barChart(dataSet, selectedYear) {
    // Clear existing SVG
    d3.select("#chart svg").remove();

    var w = 800;
    var h = 500;
    var padding = 40;

    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var xScale = d3
      .scaleBand()
      .domain(
        dataSet.map(function (d) {
          return d[""];
        })
      )
      .range([padding, w - padding])
      .padding(0.1);

    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataSet, function (d) {
          return d[selectedYear];
        }),
      ])
      .range([h - padding, padding]);

    svg
      .selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xScale(d[""]);
      })
      .attr("y", function (d) {
        return isNaN(d[selectedYear]) ? yScale(0) : yScale(d[selectedYear]);
      })
      .attr("width", xScale.bandwidth())
      .transition()
      .delay(200)
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("height", function (d) {
        return isNaN(d[selectedYear])
          ? 0
          : h - padding - yScale(d[selectedYear]);
      })
      .style("fill", "steelblue");

    svg
      .selectAll(".label")
      .data(dataSet)
      .enter()
      .append("text")
      .attr("class", "label")
      .transition()
      .delay(200)
      .duration(500)
      .ease(d3.easeCubicInOut)
      .attr("x", function (d) {
        return xScale(d[""]) + xScale.bandwidth() / 2;
      })
      .attr("y", function (d) {
        return isNaN(d[selectedYear])
          ? yScale(0) - 5
          : yScale(d[selectedYear]) - 5;
      })
      .attr("text-anchor", "middle")
      .text(function (d) {
        return isNaN(d[selectedYear]) ? "" : d[selectedYear];
      });

    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", padding / 2)
      .transition()
      .delay(200)
      .duration(800)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Depression rate for the Year " + selectedYear);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
  }

  // Stacked bar function
  function stackedBar(data) {
    // Clear existing SVG
    d3.select("#chart svg").remove();

    var w = 800;
    var h = 500;
    var padding = 40;

    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Extracting unique categories from the data
    var categories = data.map(function (d) {
      return d[""];
    });

    // Stacked data preparation
    var keys = ["2019", "2020"];
    var stackedData = d3.stack().keys(keys)(data);

    // Color scale
    var color = d3.scaleOrdinal().domain(keys).range(d3.schemeCategory10);

    // X scale
    var xScale = d3
      .scaleBand()
      .domain(categories)
      .range([padding, w - padding])
      .padding(0.1);

    // Y scale
    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(stackedData, function (d) {
          return d3.max(d, function (d) {
            return d[1];
          });
        }),
      ])
      .nice()
      .range([h - padding, padding]);

    // Draw bars
    svg
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("fill", function (d) {
        return color(d.key);
      })
      .selectAll("rect")
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .transition()
      .duration(1000)
      .ease(d3.easeCubicInOut)
      .attr("x", function (d) {
        return xScale(d.data[""]);
      })
      .attr("y", function (d) {
        return yScale(d[1]);
      })
      .attr("height", function (d) {
        return yScale(d[0]) - yScale(d[1]);
      })
      .attr("width", xScale.bandwidth());

    // X axis
    svg
      .append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .transition()
      .duration(800)
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

    // Y axis
    svg
      .append("g")
      .attr("transform", "translate(" + padding + ",0)")
      .transition()
      .duration(800)
      .call(d3.axisLeft(yScale));

    //Legends
    var legend = svg
      .selectAll("legend")
      .data(keys)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", w - padding)
      .attr("width", 18)
      .transition()
      .duration(800)
      .ease(d3.easeCubicInOut)
      .attr("height", 18)
      .attr("fill", function (d) {
        return color(d);
      });

    legend
      .append("text")
      .transition()
      .duration(800)
      .ease(d3.easeCubicInOut)
      .attr("x", w - padding - 5)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        return d;
      });

    // Chart title
    svg
      .append("text")
      .transition()
      .duration(800)
      .attr("x", w / 2)
      .attr("y", padding / 2 - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("Depression rate in 2019 and 2020");
  }

  //button event
  d3.select("#b2").on("click", function () {
    stackedBar(data, "2020"); // You can change the default selected year if needed
  });
  // Pie chart function
  function changeToPieChart(data) {
    // Clear existing SVG
    d3.select("#chart svg").remove();

    var w = 800;
    var h = 500;
    var radius = Math.min(w, h) / 2.5;
    var innerRadius = radius / 1.5;

    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .append("g")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    var color = d3.scaleOrdinal().range(d3.schemeCategory10);

    var averageData = [];
    data.forEach(function (d) {
      var averageRate = (d["2019"] + d["2020"]) / 2;
      averageData.push({
        category: d[""],
        rate: averageRate,
      });
    });

    var pie = d3.pie().value(function (d) {
      return d.rate;
    });

    var arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);

    var arcs = svg
      .selectAll("arc")
      .data(pie(averageData))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d, i) {
        return color(i);
      })
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        var interpolate = d3.interpolate(
          {
            startAngle: 0,
            endAngle: 0,
          },
          d
        );
        return function (t) {
          return arc(interpolate(t));
        };
      });

    arcs
      .append("text")
      .attr("transform", function (d) {
        var centroid = arc.centroid(d);
        return "translate(" + centroid[0] + "," + centroid[1] + ")";
      })
      .attr("text-anchor", "middle")
      .text(function (d) {
        return d.data.category + ": " + d.data.rate.toFixed(2);
      })
      .style("fill", "white")
      .style("font-size", "9px")
      .style("pointer-events", "none");

    //label
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", -radius - 30) // Adjust the position of the label
      .attr("text-anchor", "middle")
      .transition()
      .duration(500)
      .text("Average Depression Rate") // Customize the label text
      .style("font-size", "18px")
      .style("fill", "black");
  }

  // Event listener for button to switch to pie chart
  d3.select("#b1").on("click", function () {
    changeToPieChart(data);
  });
});
