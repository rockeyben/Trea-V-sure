function drawStackChart(data, order) {
    /*
        data : list within a certain range, say 30 days
    */
    var margin = { top: 20, right: 20, bottom: 40, left: 40 },
        width = 700,
        height = 500;
    //console.log(data[0].date, data[data.length - 1].date)
    var x = d3.scaleTime()
        .rangeRound([0, width])
        .domain(d3.extent(data, function (d) { return new Date(d.date); }));
    x.ticks(d3.timeDay.every(5));

    //console.log(width)
    var y = d3.scaleLinear()
        .domain([-1, 4])  
        .rangeRound([height, 0]);

    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%m-%d"))

    var yAxis = d3.axisLeft(y)
        .tickValues([-1, 0, 1, 2, 3, 4])
        .tickFormat((d) => {
            var exp = Math.pow(10, d);
            return `${exp}`;
        });

    var svg = d3.select("#tip-trend").append("svg")
        .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
                    +(height + margin.top + margin.bottom).toString()+"")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var upBound = d3.max(data, function (d) { return d.count; })
    
    
    var xband = x(new Date(data[1].date)) - x(new Date(data[0].date));
    console.log(xband)
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Money");
    
    data.forEach(function (d) {
        d.stacked = [];
        y0 = -1;
        for(i = 0; i < CATEGORY.length; i++){
            index = order[i];
            
            stackInfo = {};
            stackInfo['y0'] = y0;
            
            stackInfo['y1'] = Math.log10(Math.pow(10, y0) + d[CATEGORY[index]]);
            
            //console.log(y0, Math.pow(10, y0), d[CATEGORY[index]], stackInfo['y1']);
            y0 = stackInfo['y1'];
            if (CURR_CLASS.indexOf(index) != -1)
                stackInfo['color'] = 'rgb(136, 86, 167)';
            else
                stackInfo['color'] = 'rgb(191, 211, 230)';
            //console.log(stackInfo)
            d.stacked.push(stackInfo);
        }
    })

    var day = svg.selectAll(".stack_day")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d, i) { 
            //console.log(x(new Date(d.date)), d.date)
            return "translate(" + x(new Date(d.date)) + ",0)"; });

    day.selectAll("rect")
        .data(function (d) { return d.stacked; })
        .enter().append("rect")
        .attr("width", xband)
        .attr("y", function (d) { return y(d.y1); })
        .attr("height", function (d) {
            //console.log(d.y0, d.y1, y(d.y0), y(d.y1));
            return y(d.y0) - y(d.y1); })
        .style("fill", function (d) {
            return d.color 
        });
}

function removeStackChart(){
    var stackChart = d3.select("#tip-trend").selectAll("svg");
    stackChart.remove();
}

function updateStackChart() {
    removeStackChart();

    var s_i = date2index(STACK_START_DATE);
    var e_i = date2index(STACK_END_DATE);

    //console.log(s_i, e_i);
    var order = [];
    for (i = 0; i < CURR_CLASS.length; i++)
        order.push(CURR_CLASS[i]);
    for (i = 0; i < CATEGORY.length; i++) {
        if (CURR_CLASS.indexOf(i) == -1)
            order.push(i);
    }
    //console.log(order)
    drawStackChart(ALL_DATA[CURR_YEAR-START_YEAR].dates.slice(s_i, e_i), order);
}