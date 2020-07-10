//Bar Chart Race code

// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 0, bottom: 50, left: 0},
    width2 = 1000 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#bar_chart_race")
  .append("svg")
    .attr("viewBox", '0 0 1050 400') // to make svg responsive
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

// to convert dates
var dateFormatter2 = d3.timeFormat("%Y-%m-%d");

// length of animation
var tickDuration = 400;

//How many stocks to show
var top_n = 10;

//space between bars
let barPadding = (height2-(margin2.bottom+margin2.top))/(top_n*5);

// title and subtitle
let title = svg2.append('text')
     .attr('class', 'title')
     .attr('y', 0)
     .html('10 Most Popular Stocks on Robinhood');
let subTitle = svg2.append("text")
     .attr("class", "subTitle")
     .attr("y", 27)
     .html("Number of shares held 2020-01-16 to 2020-07-06");

// Get first day in data
let start_date = "2020-01-16";

// Get all buttons as variables
var playButton = d3.select("#play-button");
var pauseButton = d3.select("#pause-button");
var resetButton = d3.select("#reset-button");

// Read data and create plot
d3.csv('https://raw.githubusercontent.com/jonathangiguere/Robinhood_Investment_Web_App/master/data/top_50_popularity.csv', function(data) {

    // Format data
    data.forEach(d => {
        d.users_holding = +d.users_holding,
        d.timestamp_date = d3.timeParse("%Y-%m-%d")(d.timestamp), //Get date as date object
        d.colour = '#74ec74'
    });

    // filter data for first day of data
    let daySlice = data.filter(d => d.timestamp == start_date)
        .sort((a,b) => b.users_holding - a.users_holding)
        .slice(0, top_n);

        daySlice.forEach((d,i) => d.rank = i); // rank top 10 by popularity

    // Scales and axes
    let x2 = d3.scaleLinear()
        .domain([0, d3.max(daySlice, d => d.users_holding)])
        .range([margin.left, width + 130]);

    let y2 = d3.scaleLinear()
        .domain([top_n, 0])
        .range([height-margin.bottom, margin.top]);

    let xAxis2 = d3.axisTop()
        .scale(x2)
        .ticks(width > 500 ? 5:2)
        .tickSize(-(height-margin.top-margin.bottom))
        .tickFormat(d => d3.format(',')(d));

    svg2.append('g')
       .attr('class', 'axis xAxis')
       .attr('transform', `translate(0, ${margin.top})`)
       .call(xAxis2)
       .selectAll('.tick line')
       .classed('origin', d => d == 0);

    // Add bars
    svg2.selectAll('rect.bar')
        .data(daySlice, d => d.Ticker)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x2(0)+1)
        .attr('width', d => x2(d.users_holding)-x2(0)-1)
        .attr('y', d => y2(d.rank)+5)
        .attr('height', y2(1)-y2(0)-barPadding)
        .style('fill', d => d.colour);

    // Ticker label for bars
    svg2.selectAll('text.label')
        .data(daySlice, d => d.Ticker)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x2(d.users_holding)-8)
        .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+3)
        .style('text-anchor', 'end')
        .html(d => d.Ticker);

    // Year label
    let dayText = svg2.append('text')
      .attr('class', 'yearText')
      .attr('x', width2-190)
      .attr('y', height2-50)
      .style('text-anchor', 'end')
      .html(start_date);

    // ----------------------------------------------------------------------------------------

    // call function when play button is clicked
    playButton
        .on("click", toggleAnimating);

    var animateTimer;

    // function that does animation
    // Basically updates the start date each iteration to get that day's data
    function toggleAnimating(){

          animateTimer = setInterval(function(){

              // filter data for next day
              daySlice = data.filter(d => d.timestamp == start_date)
                .sort((a,b) => b.users_holding - a.users_holding)
                .slice(0,top_n);

              daySlice.forEach((d,i) => d.rank = i);

              // Update x axis
              x2.domain([0, d3.max(daySlice, d => d.users_holding)]);

              svg2.select('.xAxis')
                .transition()
                .duration(tickDuration)
                .ease(d3.easeLinear)
                .call(xAxis2);

              // Update bars
              let bars = svg2.selectAll('.bar').data(daySlice, d => d.Ticker);

               bars
                .enter()
                .append('rect')
                .attr('class', d => `bar ${d.Ticker.replace(/\s/g,'_')}`)
                .attr('x', x2(0)+1)
                .attr( 'width', d => x2(d.users_holding)-x2(0)-1)
                .attr('y', d => y2(top_n+1)+5)
                .attr('height', y2(1)-y2(0)-barPadding)
                .style('fill', d => d.colour)
                .transition()
                  .duration(tickDuration)
                  .ease(d3.easeLinear)
                  .attr('y', d => y2(d.rank)+5);

               bars
                .transition()
                  .duration(tickDuration)
                  .ease(d3.easeLinear)
                  .attr('width', d => x2(d.users_holding)-x2(0)-1)
                  .attr('y', d => y2(d.rank)+5);

               bars
                .exit()
                .transition()
                  .duration(tickDuration)
                  .ease(d3.easeLinear)
                  .attr('width', d => x2(d.users_holding)-x2(0)-1)
                  .attr('y', d => y2(top_n+1)+10000) //add 10,000 to get bar out of svg canvas
                  .remove();

              // Update labels on bars
              let labels = svg2.selectAll('.label')
                    .data(daySlice, d => d.Ticker);

               labels
                .enter()
                .append('text')
                .attr('class', 'label')
                .attr('x', d => x2(d.users_holding)-8)
                .attr('y', d => y2(top_n+1)+5+((y2(1)-y2(0))/2))
                .style('text-anchor', 'end')
                .html(d => d.Ticker)
                .transition()
                  .duration(tickDuration)
                  .ease(d3.easeLinear)
                  .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+3);

               labels
                  .transition()
                  .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('x', d => x2(d.users_holding)-8)
                    .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+3);

               labels
                  .exit()
                  .transition()
                    .duration(tickDuration)
                    .ease(d3.easeLinear)
                    .attr('x', d => x2(d.users_holding)-8)
                    .attr('y', d => y2(top_n+1)+10000) // add 10,000 to get label out of svg canvas
                    .remove();

              // Update date text in bottom right
              dayText.html(start_date);

              // clear interval on pause button click
              // this pauses the animation
              pauseButton
                .on("click", function() {
                  clearInterval(animateTimer);
                });

              // Reset date to first date when reset button is clicked
              resetButton
                .on("click", function() {
                  start_date = "2020-01-16";
                });

            //End the ticker with specified date
            if(start_date == "2020-07-06") clearInterval(animateTimer);

              // This is where the date string gets converted to a date object
              // Then it gets incremented and turned back into a string to filter
              // data for the next day
              var start_date_date = d3.timeParse("%Y-%m-%d")(start_date);
              var tomorrow = start_date_date;
              tomorrow.setDate(start_date_date.getDate() + 1);
              start_date = dateFormatter2(tomorrow);
              },tickDuration);
            }
          })
