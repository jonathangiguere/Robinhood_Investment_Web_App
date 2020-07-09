//Bar Chart Race code

// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 0, bottom: 50, left: 0},
    width2 = 1000 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
var svg2 = d3.select("#bar_chart_race")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");


var dateFormatter2 = d3.timeFormat("%Y-%m-%d");

var tickDuration = 400;
var top_n = 10;

let barPadding = (height2-(margin2.bottom+margin2.top))/(top_n*5);

let title = svg2.append('text')
     .attr('class', 'title')
     .attr('y', 0)
     .html('10 Most Popular Stocks on Robinhood');

let subTitle = svg2.append("text")
     .attr("class", "subTitle")
     .attr("y", 27)
     .html("Number of shares held 2020-01-16 to 2020-07-06");

// Get first day of 2020
let start_date = "2020-01-16";
//console.log(start_date);

//play button
var moving = false;
var playButton = d3.select("#play-button");
var pauseButton = d3.select("#pause-button");
var resetButton = d3.select("#reset-button");

d3.csv('https://raw.githubusercontent.com/jonathangiguere/Robinhood_Investment_Web_App/master/data/top_50_popularity.csv', function(data) {
    //if (error) throw error;
    //console.log(data);

    // Format data
    data.forEach(d => {
        d.users_holding = +d.users_holding,
        //d.lastValue = +d.lastValue,
        d.timestamp_date = d3.timeParse("%Y-%m-%d")(d.timestamp), //Get date as date object
        //d.colour = d3.hsl(Math.random()*360,0.75,0.75)
        d.colour = '#74ec74'
    });

    //console.log(data);

    let daySlice = data.filter(d => d.timestamp == start_date)
        .sort((a,b) => b.users_holding - a.users_holding)
        .slice(0, top_n);

        daySlice.forEach((d,i) => d.rank = i);

    //console.log('daySlice: ', daySlice)

    let x2 = d3.scaleLinear()
        .domain([0, d3.max(daySlice, d => d.users_holding)])
        .range([margin.left, width + 110]);

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
    let ticker = d3.interval(e => {

        daySlice = data.filter(d => d.timestamp == start_date)
            .sort((a,b) => b.users_holding - a.users_holding)
            .slice(0,top_n);

        daySlice.forEach((d,i) => d.rank = i);

        //console.log('IntervalYear: ', daySlice);

        x2.domain([0, d3.max(daySlice, d => d.users_holding)]);

        svg2.select('.xAxis')
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .call(xAxis2);

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

      //console.log(start_date)
      dayText.html(start_date);

      pauseButton
        .on("click", function() {
          ticker.stop();
        });

      resetButton
        .on("click", function() {
          start_date = "2020-01-16";
        });

      playButton
        .on("click", function() {
            //var start_date_date = d3.timeParse("%Y-%m-%d")(start_date);
            //var tomorrow = start_date_date;
            //tomorrow.setDate(start_date_date.getDate() + 1);
            //start_date = dateFormatter2(tomorrow);
            ticker
        });

      //End the ticker with specified date
      if(start_date == "2020-07-06") ticker.stop();
        var start_date_date = d3.timeParse("%Y-%m-%d")(start_date); //get current val for start date as date
        //console.log('start date date:', start_date_date);
        var tomorrow = start_date_date;
        tomorrow.setDate(start_date_date.getDate() + 1); // increment date obj by 1
        //console.log('next day date', tomorrow);
        start_date = dateFormatter2(tomorrow); // convert incremented day back to string
        //console.log('next day string:', start_date);
      },tickDuration);

    });
    // ----------------------------------------------------------------------------------------





