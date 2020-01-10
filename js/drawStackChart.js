function drawStackChart(data, order) {
    /*
        data : list within a certain range, say 30 days
    */
    var margin = { top: 20, right: 20, bottom: 40, left: 40 },
        width = 700,
        height = 500;

    //console.log(data[0].date, data[data.length - 1].date)

    let extd = d3.extent(data, function (d) { return new Date(d.date); });
    extd[1].setDate(extd[1].getDate()+1);

    var xX = d3.scaleTime()
        .rangeRound([0, width])
        .domain(extd);
    xX.ticks(d3.timeDay.every(5));

    var y = d3.scaleLinear()
        .domain([0, 8])  
        .rangeRound([height, 0]);

    var xAxis = d3.axisBottom(xX)
        .tickFormat(d3.timeFormat("%m-%d"))

    var axis_text = ['0.1', '1', '10', '100', '1000', '10000'];
    var log_scales = [0.1, 1, 10, 100, 1000, 10000];
    var tick_scales = [0.25, 0.5, 1, 3, 6, 8];
    var yAxis = d3.axisLeft(y)
        .tickValues(tick_scales)
        .tickFormat((d, i) => {
            var exp = axis_text[i];
            return `${exp}`;
        });

    var svg = d3.select("#tip-trend").append("svg")
        .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
                    +(height + margin.top + margin.bottom).toString()+"")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var upBound = d3.max(data, function (d) { return d.count; })
    
    
    console.log(data)
    console.log("xband start");
    var date_debug_1 = new Date(data[1].date);
    // date_debug_1.setDate(date_debug_1.getDate()+1);
    var date_debug_0 = new Date(data[0].date);
    console.log(date_debug_0);
    console.log(date_debug_1);
    var xband = xX(date_debug_1) - xX(date_debug_0);
    // console.log(xband);
    console.log("xband end");

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
        // selected class
        y0 = 0;
        stackInfo = {};
        stackInfo['y0'] = y0;
        var stackCnt1 = 0;
        for(i = 0; i < CATEGORY.length; i++){
            if (CURR_CLASS.indexOf(i) != -1){
                stackCnt1 += d[CATEGORY[i]];
            }
        }
        var logNum = (Math.log10(stackCnt1) - (-1));
        if (logNum <= 2)
            stackInfo['y1'] = Math.pow(2, logNum)*0.25;
        else if(logNum < 5){
            var logInt = Math.floor(logNum);
            stackInfo['y1'] = tick_scales[logInt] + (stackCnt1 - log_scales[logInt]) / (log_scales[logInt+1] - log_scales[logInt]);
        }else{
            stackInfo['y1'] = tick_scales[tick_scales.length-1]
        }
        y0 += stackInfo['y1'];
        stackInfo['color'] = 'rgb(136, 86, 167)';
        d.stacked.push(stackInfo);

        // unselected class
        stackInfo = {};
        stackInfo['y0'] = y0;
        for (i = 0; i < CATEGORY.length; i++) {
            if (CURR_CLASS.indexOf(i) == -1) {
                stackCnt1 += d[CATEGORY[i]];
            }
        }
        logNum = (Math.log10(stackCnt1) - (-1));
        if (logNum <= 2)
            stackInfo['y1'] = Math.pow(2, logNum) * 0.25;
        else if (logNum < 5) {
            var logInt = Math.floor(logNum);
            stackInfo['y1'] = tick_scales[logInt] + (stackCnt1 - log_scales[logInt]) / (log_scales[logInt + 1] - log_scales[logInt]);
        } else {
            stackInfo['y1'] = tick_scales[tick_scales.length - 1]
        }        

        stackInfo['color'] = 'rgb(191, 211, 230)';
        d.stacked.push(stackInfo);
    })

    var day = svg.selectAll(".stack_day")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function (d, i) { 
            //console.log(xX(new Date(d.date)), d.date)
            return "translate(" + xX(new Date(d.date)) + ",0)"; });

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
    drawStackChart(ALL_DATA[CURR_YEAR-START_YEAR].dates.slice(s_i, e_i+1), order);
}