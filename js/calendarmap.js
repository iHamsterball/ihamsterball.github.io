var data_array={
  "20150125":1,
  "20150221":1,
  "20150306":1,
  "20150307":1,
  "20150310":1,
  "20150314":2,
  "20150322":3,
  "20150323":3,
  "20150326":1,
  "20150416":3,
  "20150427":2,
  "20150505":2,
  "20150507":1,
  "20150509":1,
  "20150519":1,
  "20150520":1,
  "20150521":1,
  "20150604":14,
  "20150605":1,
  "20150623":4,
  "20150625":1,
  "20150627":3,
  "20150715":2,
  "20150720":2,
  "20150722":1,
  "20150724":2,
  "20150804":2,
  "20150818":1,
  "20151005":3,
  "20151012":2,
  "20151130":1,
  "20151205":1,
  "20160101":2,
  "20160107":2,
  "20160108":10,
  "20160111":2,
  "20160122":5,
  "20160124":4,
  "20160129":1,
  "20160130":1,
  "20160131":1,
  "20160202":4,
  "20160203":1,
  "20160203":2,
  "20160203":4,
  "20160203":5,
  "20160203":6,
  "20160203":7,
  "20160203":9,
  "20160203":10,
  "20160203":11,
  "20160203":12
};

var width = 900,
    height = 120,
    cellSize = 15; // cell size
    month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    color = ["#eee","#d6e685","#8cc665","#44a340","#1e6823"];
    range = [0,1,5,9];

var day = d3.time.format("%w"),
    week = d3.time.format("%U"),
    percent = d3.format(".1%"),
	format = d3.time.format("%Y%m%d");
	parseDate = d3.time.format("%Y%m%d").parse;


var svg = d3.select(".calendar-map").selectAll("svg")
    .data(d3.range(2015, 2017))
  .enter().append("svg")
    .attr("width", '100%')
    .attr("data-height", '0.5678')
    .attr("viewBox",'0 0 ' + width + ' ' + height)
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-10," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });


var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter()
	.append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .attr("fill",'#eee')
    .datum(format);

var legend = svg.selectAll(".legend")
      .data(month)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (((i+1) * 50)+8) + ",0)"; });


svg.selectAll(".month")
    .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("style", "stroke:grey")
    .attr("d", monthPath);

function getRange(d) {
  for (i = 1; i < range.length; i++) {
    if (d < range[i])
      return i;
  }
  return -1;
}

function getColor(d) {
  if (d == 0)
    return color[0];
  if (d >= range[range.length - 1])
    return color[range.length];
  index = getRange(d);
  change = d3.scale.linear().range([color[index - 1], color[index]])
    .domain([range[index - 1], range[index]])
  return change(d)
}

  rect
      .attr("fill", function(d) {if (isNaN(data_array[d])) return color[0];  return getColor(data_array[d]); })
	  .attr("data-title", function(d) { if (isNaN(data_array[d])) ret = "No record on "; else {if(data_array[d] == 1) ret = data_array[d] + " commit on "; else ret = data_array[d] + " commits on ";} return ret + month[parseDate(d).getMonth()] + ". " + parseDate(d).getDate()});

d3.csv("",function() {
	$("rect").tooltip({container: 'body'});

});

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = +day(t0), w0 = +week(t0),
      d1 = +day(t1), w1 = +week(t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}
