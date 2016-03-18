
var margin = {left: 80, top: 20, right: 70, bottom: 20};

var width = 1000 - margin.left - margin.right,
    height = 540 - margin.top - margin.bottom;

var max_x = 1000;

var verbosed = {
    "К":"Купейний",
    "П":"Плацкартний",
    "Л":"Люкс",
    "М":"М'який",
    "С":"Сидячий",
    "О":"Загальний"
};

d3.csv('data_price_10_2014.csv', function(err, data) {
    var max_price = d3.max(data, function(d){return d.price});

    var nested = d3.nest()
        .key(function(d){return d.tipvg})
        .entries(data);

    var stack = d3.layout.stack(); //.offset("wiggle"),
        stacked_data = nested.map(function(l){return l.values.map(function(d){return {x: +d.price, y: +d.count, name: l.key}})}),
        layers = stack(stacked_data);

    var x = d3.scale.linear()
        .domain([1, max_x - 1])
        .range([0, width]);

    var y = d3.scale.linear()
        .domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
        .range([height, 0]);

    var color = d3.scale.linear()
        .range(["#aad", "#556"]);

    var area = d3.svg.area()
        .x(function(d) { return x(d.x); })
        .y0(function(d) { return y(d.y0); })
        .y1(function(d) { return y(d.y0 + d.y); })
        .interpolate('basis');

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append('g')
        .translate([margin.left, margin.top]);

    color = d3.scale.category20();

    color = colorbrewer.RdYlBu['6'];

    svg.selectAll("path")
        .data(layers)
        .enter().append("path")
        .attr("d", area)
        .style("fill", function(d,i) { return color[i]; });

    var x_axis = d3.svg.axis()
        .scale(x);

    var y_axis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .tickFormat(d3.format('s'));

    svg.append('g')
        .attr('class', 'x axis')
        .translate([0, height])
        .call(x_axis)
        .append('text')
        .attr('x', width - 40)
        .attr('dy', '1.3em')
        .text("вартість квитка, грн");

    svg.append('g')
        .attr('class', 'y axis')
        //.translate([])
        //.translate([0, height])
        .call(y_axis)
        .append('text')
        .attr('y', '5em')
        .style('font-size', '14px')
        .tspans(["Площі - відповідають сумам доходу від продажу кожного типу квитка," ,"їх можна порівнювати між собою", " ", "Висота смуг - сума отримана в результаті продажу квитка відповідного типу"], 18)
        .attr('dx', 270);


    var legendItem = svg.append('g')
        .attr('class', 'legend')
        .translate([width - 40, 20])
        .selectAll("g.legendItem")
        .data(nested.map(function(d){return d.key}))
        .enter()
        .append('g')
        .attr('class', 'legendItem');

    legendItem.append('rect')
        .style('fill', function(d,i){return color[i]})
        .attr('y', function(d,i){return i*25})
        .attr('width', 20)
        .attr('height', 20);

    legendItem.append('text')
        .translate(function(d,i){return [25, i*25]})
        .attr("dy", '1.3em')
        .text(function(d){return d + " - " + verbosed[d]});

});

function legend() {





}

//
//
//function transition() {
//    d3.selectAll("path")
//        .data(function() {
//            var d = layers1;
//            layers1 = layers;
//            return layers = d;
//        })
//        .transition()
//        .duration(2500)
//        .attr("d", area);
//}