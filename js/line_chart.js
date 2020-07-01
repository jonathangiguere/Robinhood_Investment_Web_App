//Dynamic line chart code

// set the dimensions and margins of the graph
var margin = {top: 50, right: 100, bottom: 50, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Create bisector to be used for tool tip mouse over
var bisectDate = d3.bisector(function(d) { return d.begins_at; }).left;

// Create formatting rules for tool tip
var formatValue = d3.format("$,.2f");
var dateFormatter = d3.timeFormat("%m/%d/%y");

// append the svg object to the body of the page
var svg = d3.select("#line_chart_dynamic")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("https://raw.githubusercontent.com/jonathangiguere/Robinhood_Investment_Web_App/master/data/top_ten.csv", function(data) {

    // format the data
    data.forEach(function(d) {
            d.begins_at = d3.timeParse("%Y-%m-%d")(d.begins_at);
            d.volume = +d.volume;
            d.close_price = +d.close_price;
    });

    // List of groups by stock symbol
    var allGroup = d3.map(data, function(d){return(d.symbol)}).keys()

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

      // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.begins_at; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Filter for AAPL which is first up
    var dataFilter = data.filter(function(d){return d.symbol=='AAPL'})

    // Add Y axis with selected group to get y axis right
    var y = d3.scaleLinear()
      .domain([d3.min(dataFilter, function(d) { return d.close_price; }), d3.max(dataFilter, function(d) { return d.close_price; })])
      .range([ height, 0 ]);
    svg.append("g")
      .attr("class", "y_axis")
      .call(d3.axisLeft(y)
        .tickFormat(d3.format("$.2f")));

    // Initialize the Y axis for the bar chart
    var y_bar = d3.scaleLinear()
      .range([ height,0]);
    var yAxis = svg.append("g")
      .attr("class", "myYaxis");

    // Initialize the X axis for the bar chart
    var x_bar = d3.scaleBand()
      .range([ 0, width ])
      .padding(0.5);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")");

    // Add Y axis for bar chart
    y_bar
        .domain([0, d3.max(data, function(d) { return d.volume }) ]);
    yAxis
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y_bar)
            .tickFormat(d3.format(".2s")));

    // text label for the y axis
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 25 - margin.left)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Market Close Price");

    // text label for the 2nd y axis
      svg.append("text")
          .attr("transform", "rotate(90)")
          .attr("y", -850)
          .attr("x", (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Market Close Price");

    // add X axis for bar chart
    x_bar
        .domain(data.map(function(d) { return dateFormatter(d.begins_at); }))
    xAxis
        .transition()
        .duration(1000)
        .attr('id', 'x_bar_axis')
        .call(d3.axisTop(x_bar));

    // text label for the x axis
    svg.append("text")
        .attr("y", height - (margin.top - 90))
        .attr("x", (width / 2))
        .style("text-anchor", "middle")
        .text("Day");


    // variable u: map data to existing bars
    var u = svg.selectAll("rect")
      .data(dataFilter)

    // update bars
    u
      .enter()
      .append("rect")
      .merge(u)
        .attr("x", function(d) { return x_bar(dateFormatter(d.begins_at)); })
        .attr("y", function(d) { return y_bar(d.volume); })
        .attr("width", x_bar.bandwidth())
        .attr("height", function(d) { return height - y_bar(d.volume); })
        .attr("fill", "rgb(102, 194, 165)")

    // Initialize line with first group of the list
    var line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d){return d.symbol==allGroup[0]}))
        .attr("d", d3.line()
          .x(function(d) { return x(d.begins_at) })
          .y(function(d) { return y(d.close_price) })
        )
        .attr("stroke", 'rgb(102, 194, 165)')
        .style("stroke-width", 2)
        .style("fill", "none")

    // appending group element to SVG canvas
    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    // Add a circle to focus group
     focus.append("circle")
        .attr("r", 3);

    // Add actual tool tip box to focus group
    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 160)
        .attr("height", 50)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    // Text for dat
    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2);

    // Text for volume
    focus.append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text("Close Price:");

    focus.append("text")
        .attr("class", "tooltip-likes")
        .attr("x", 100)
        .attr("y", 18);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(dataFilter, x0, 1),
            d0 = dataFilter[i - 1],
            d1 = dataFilter[i],
            d = x0 - d0.begins_at > d1.begins_at - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.begins_at) + "," + y(d.close_price) + ")");
        focus.select(".tooltip-date").text(dateFormatter(d.begins_at));
        focus.select(".tooltip-likes").text(formatValue(d.close_price));
    }

    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      var dataFilter = data.filter(function(d){return d.symbol==selectedGroup});

      // Add Y axis with selected group to get y axis right
        var y = d3.scaleLinear()
          .domain([d3.min(dataFilter, function(d) { return d.close_price; }), d3.max(dataFilter, function(d) { return d.close_price; })])
          .range([ height, 0 ]);
        svg.append("g")
          .attr("class", "y_axis")
          .transition()
          .duration(1000)
          .call(d3.axisLeft(y)
            .tickFormat(d3.format("$.2f")));

      // Give these new data to update line
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.begins_at) })
            .y(function(d) { return y(d.close_price) })
          )
          .attr("stroke", function(d){ return myColor(selectedGroup) })

        // Add Y axis for bar chart
        y_bar
            .domain([0, d3.max(dataFilter, function(d) { return d.volume + 30000000 }) ]);
        yAxis
            .transition()
            .duration(1000)
            .attr("transform", "translate(" + width + ",0)")
            .call(d3.axisRight(y_bar)
                .tickFormat(d3.format(".2s")));

        // add X axis for bar chart
        x_bar
            .domain(dataFilter.map(function(d) { return dateFormatter(d.begins_at); }))
        xAxis
            .attr('id', 'x_bar_axis')
            .call(d3.axisTop(x_bar));


        // variable u: map data to existing bars
        var u = svg.selectAll("rect")
          .data(dataFilter)

        // update bars
        u
          .enter()
          .append("rect")
          .merge(u)
          .transition()
        .duration(1000)
            .attr("x", function(d) { return x_bar(dateFormatter(d.begins_at)); })
            .attr("y", function(d) { return y_bar(d.volume); })
            .attr("width", x_bar.bandwidth())
            .attr("height", function(d) { return height - y_bar(d.volume); })
            .attr("fill", function(d){ return myColor(selectedGroup) })


        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(dataFilter, x0, 1),
            d0 = dataFilter[i - 1],
            d1 = dataFilter[i],
            d = x0 - d0.begins_at > d1.begins_at - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.begins_at) + "," + y(d.close_price) + ")");
            focus.select(".tooltip-date").text(dateFormatter(d.begins_at));
            focus.select(".tooltip-likes").text(formatValue(d.close_price));
    }
    }

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {

        // Select y axis by HTML class and remove when selection is changed
        var old_y_axis = d3.select('.y_axis');
            old_y_axis.remove();

        // Select overlay rect by HTML class and remove when selection is changed
        var old_rect = d3.select('.overlay');
            old_rect.remove();

        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")

        // run the updateChart function with this selected option
        update(selectedOption)
    })
});
