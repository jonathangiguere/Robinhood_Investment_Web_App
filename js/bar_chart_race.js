//Bar Chart Race code

// set the dimensions and margins of the graph
var margin = {top: 50, right: 100, bottom: 50, left: 100},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#bar_chart_race")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


var tickDuration = 500;
var top_n = 10;

let barPadding = (height-(margin.bottom+margin.top))/(top_n*5);

let title = svg.append('text')
     .attr('class', 'title')
     .attr('y', 24)
     .html('Most Popular Stocks 2018-Present');

// Get first date in dataset
let start_date = "2018-05-02";
console.log(start_date);

d3.csv('https://raw.githubusercontent.com/jonathangiguere/Robinhood_Investment_Web_App/master/data/top_50_popularity.csv', function(data) {
    //if (error) throw error;

    //console.log(data);

    // Format data
    data.forEach(d => {
        d.users_holding = +d.users_holding,
        //d.rank = 0,
        //d.lastValue = +d.lastValue,
        d.timestamp_date = d3.timeParse("%Y-%m-%d")(d.timestamp) //Get date as date object
        //d.colour = d3.hsl(Math.random()*360,0.75,0.75)
    });

    console.log(data);

    let daySlice = data.filter(d => d.timestamp == start_date)
        .sort((a,b) => b.users_holding - a.users_holding)
        .slice(0, top_n);

        //daySlice.forEach((d,i) => d.rank = i);

    console.log('daySlice: ', daySlice)

}); // end of data read functions
