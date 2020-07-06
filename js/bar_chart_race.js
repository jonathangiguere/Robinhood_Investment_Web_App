//Bar Chart Race code

// set the dimensions and margins of the graph
var margin2 = {top: 50, right: 100, bottom: 50, left: 100},
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


var dateFormatter2 = d3.timeFormat("%Y/%m/%d");

var tickDuration = 500;
var top_n = 10;

let barPadding = (height2-(margin2.bottom+margin2.top))/(top_n*5);

let title = svg2.append('text')
     .attr('class', 'title')
     .attr('y', 24)
     .html('Most Popular Stocks 2018-Present');

// Get first date in dataset
let start_date = "2018-05-02";
//console.log(start_date);

d3.csv('https://raw.githubusercontent.com/jonathangiguere/Robinhood_Investment_Web_App/master/data/top_50_popularity.csv', function(data) {
    //if (error) throw error;

    //console.log(data);

    // Format data
    data.forEach(d => {
        d.users_holding = +d.users_holding,
        //d.rank = 0,
        //d.lastValue = +d.lastValue,
        d.timestamp_date = d3.timeParse("%Y-%m-%d")(d.timestamp), //Get date as date object
        d.colour = d3.hsl(Math.random()*360,0.75,0.75)
    });

    //console.log(data);

    let daySlice = data.filter(d => d.timestamp == start_date)
        .sort((a,b) => b.users_holding - a.users_holding)
        .slice(0, top_n);

        daySlice.forEach((d,i) => d.rank = i);

    //console.log('daySlice: ', daySlice)

    let x2 = d3.scaleLinear()
        .domain([0, d3.max(daySlice, d => d.users_holding)])
        .range([margin.left, width-margin.right-65]);

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
        .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+5)
        .style('text-anchor', 'end')
        .html(d => d.Ticker);

    // Value label for bars
    svg2.selectAll('text.valueLabel')
      .data(daySlice, d => d.Ticker)
      .enter()
      .append('text')
      .attr('class', 'valueLabel')
      .attr('x', d => x2(d.users_holding)+5)
      .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+5)
      .text(d => d3.format(',.0f')(d.users_holding));

    // Year label
    let dayText = svg2.append('text')
      .attr('class', 'yearText')
      .attr('x', width2-margin2.right)
      .attr('y', height2-25)
      .style('text-anchor', 'end')
      .html(~~start_date)
      .call(halo, 10);

    // ----------------------------------------------------------------------------------------

    let ticker = d3.interval(e => {

        daySlice = data.filter(d => d.timestamp == start_date)
            .sort((a,b) => b.users_holding - a.users_holding)
            .slice(0,top_n);

        daySlice.forEach((d,i) => d.rank = i);

        console.log('IntervalYear: ', daySlice);

        x2.domain([0, d3.max(daySlice, d => d.users_holding)]);

        svg2.select('.xAxis')
        .transition()
        .duration(tickDuration)
        .ease(d3.easeLinear)
        .call(xAxis2);

       let bars = svg.selectAll('.bar').data(daySlice, d => d.name);

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
          .attr('y', d => y2(top_n+1)+5)
          .remove();

       let labels = svg.selectAll('.label')
          .data(daySlice, d => d.name);

       labels
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x2(d.users_holding)-8)
        .attr('y', d => y2(top_n+1)+5+((y2(1)-y2(0))/2))
        .style('text-anchor', 'end')
        .html(d => d.name)
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+1);


       labels
          .transition()
          .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x2(d.users_holding)-8)
            .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+1);

       labels
          .exit()
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x2(d.users_holding)-8)
            .attr('y', d => y2(top_n+1)+5)
            .remove();



       let valueLabels = svg.selectAll('.valueLabel').data(daySlice, d => d.name);

       valueLabels
          .enter()
          .append('text')
          .attr('class', 'valueLabel')
          .attr('x', d => x2(d.users_holding)+5)
          .attr('y', d => y2(top_n+1)+5)
          .text(d => d3.format(',.0f')(d.lastValue))
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+1);

       valueLabels
          .transition()
            .duration(tickDuration)
            .ease(d3.easeLinear)
            .attr('x', d => x2(d.users_holding)+5)
            .attr('y', d => y2(d.rank)+5+((y2(1)-y2(0))/2)+1)
            .tween("text", function(d) {
               let i = d3.interpolateRound(d.lastValue, d.users_holding);
               return function(t) {
                 this.textContent = d3.format(',')(i(t));
              };
            });

    valueLabels
        .exit()
        .transition()
          .duration(tickDuration)
          .ease(d3.easeLinear)
          .attr('x', d => x2(d.users_holding)+5)
          .attr('y', d => y2(top_n+1)+5)
          .remove();

      dayText.html(~~start_date);

     if(start_date == "2020-07-06") ticker.stop();
     var next_day = new Date(start_date);
     next_day.setDate(next_day.getDate() + 1);
     console.log(next_day);
     start_date = dateFormatter2(next_day);
     console.log(start_day);
   },tickDuration);

 });

 const halo = function(text, strokeWidth) {
  text.select(function() { return this.parentNode.insertBefore(this.cloneNode(true), this); })
    .style('fill', '#ffffff')
     .style( 'stroke','#ffffff')
     .style('stroke-width', strokeWidth)
     .style('stroke-linejoin', 'round')
     .style('opacity', 1);

}

    // ----------------------------------------------------------------------------------------





