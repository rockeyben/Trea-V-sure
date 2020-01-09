function createHeatMap(data, startYear, endYear) {
    // var width = $(".results").width();
    var width = CELL_SIZE * 56;
    var height = CELL_SIZE * 7;
    var margin = {top: 10, right: 10, bottom: 10, left: 10};
    var dx = 35;
    var gridClass = 'js-date-grid day';

    var dates = data.dates;
    var upBound = 0;
    dates.forEach((d) => {
        d.count = 0;
        d.income = 0;
        d.outcome = 0;
        for (c = 0; c < CATEGORY.length; c++) {
            if (c <= 7 && CURR_CLASS.indexOf(c) != -1) {
                d.income += d[CATEGORY[c]];
            }
            else if (c > 7 && CURR_CLASS.indexOf(c) != -1) {
                d.outcome += d[CATEGORY[c]];
            }
        }
        d.count = d.income - d.outcome;
        upBound = Math.max(upBound, Math.abs(d.count));
    });
    
    var formatColor = d3.scaleQuantize()
        .domain([0, 5])
        .range(d3.range(NUMBER_OF_COLORS)
        .map((d) => `color0-${d}`));

    var formatColorOutcome = d3.scaleQuantize()
        .domain([0, 5])
        .range(d3.range(NUMBER_OF_COLORS)
            .map((d) => `color1-${d}`));

    var heatmapSvg = d3.select('#js-heatmap').selectAll('svg.heatmap')
        .enter()
        .append('svg')
        .data(d3.range(startYear, endYear))
        .enter()
        .append('svg')
        .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
                    +(height + margin.top + margin.bottom).toString()+"")
        .attr('class', 'color')

    
    // Add a grid for each day between the date range.
    
    var rect = heatmapSvg.append('g')
        .attr('transform', `translate(${dx},0)`);

    var div = d3.select('#tooltip').append("div")
        .attr('class', 'd3-tip')
        .style('opacity', 0);

    // Add year label.
    rect.append('text')
        .attr('transform', `translate(-9,${CELL_SIZE * 3.5})rotate(-90)`)
        .style('text-anchor', 'middle')
        .attr('class', 'text-year')
        .text((d) => d);



    //console.log(dates)
    rect.selectAll('.day')
        // The heatmap will contain all the days in that year.
        .data(dates)
        .enter()
        .append('rect')
        .attr('class', gridClass)
        .attr('width', CELL_SIZE-1)
        .attr('height', CELL_SIZE-1)
        .attr('x', (d) => d3.timeFormat('%U')(new Date(d.date)) * CELL_SIZE)
        .attr('y', (d) => (new Date(d.date)).getDay() * CELL_SIZE)
        .attr('date', (d) => d.date)
        // Add the colors to the grids.
        .attr('class', function(d) { 
                //console.log(upBound, d.count)
                if(upBound == 0 || d.count == 0)
                    return `${gridClass} #eee`
                else if(d.count > 0)
                    return `${gridClass} ${formatColor(Math.log10(d.count))}`
                else if(d.count < 0)
                    return `${gridClass} ${formatColorOutcome(Math.log10(-d.count))}`
            })
        .on('click', function (d) {
            rect.selectAll('.day').classed("clicked",false);
            this.classList.add("clicked");
            //console.log(IS_SELECTING)


            if (IS_SELECTING == 0){
                IS_SELECTING = 1;
                d3.select('#date-selecter-btn')
                    .text('请在图中点击');
                d3.select('#date_text_1')
                    .text('开始：[请在图中点击开始日期]；');
                d3.select('#date_text_2')
                    .text('结束：[待稍后选择]。');

                STACK_START_DATE = new Date(d.date);
                IS_SELECTING += 1;
                updateDateText1();
                d3.selectAll('.day').classed("selected-1", false)
                d3.select(this).classed("selected-1", true)
            }
            else if(IS_SELECTING == 1){
                STACK_START_DATE = new Date(d.date);
                IS_SELECTING += 1;
                updateDateText1();
                d3.selectAll('.day').classed("selected-1", false)
                d3.select(this).classed("selected-1", true)
            }
            else if(IS_SELECTING == 2){
                STACK_END_DATE = new Date(d.date);

                if (STACK_START_DATE - STACK_END_DATE > 0){
                    var tmp = STACK_END_DATE;
                    STACK_END_DATE = STACK_START_DATE;
                    STACK_START_DATE = tmp;
                }
                updateDateText1();
                updateDateText2();
                updateStackChart();
                updateCirc();
                IS_SELECTING = 0;
            }
            // else {
            //     console.log(date2index(new Date(d.date)))
            // }

            CURR_DATE = new Date(d.date);
            updateRecordList();
        })
        .on('mouseover', function (d) {
            this.classList.add("hovered");
            var timeFormat = d3.timeFormat('%Y-%m-%d');
            //console.log(d.date)
            div.transition()
                .style('opacity', .9);
            var vis_html = "<span id='tooltip' style='color: black'>" + d.date + "</span></br></br>";
            CATEGORY.forEach((c)=>{
                if(d[c] > 0){
                    vis_html += "<span id='tooltip' style='color: black'>" + c + ":" + d[c] + "</span></br>";
                }
            })
            div.html(vis_html) 
                .style('left', (d3.event.pageX+10)+'px')
                .style('top', (d3.event.pageY+10)+'px')
        })
        .on("mouseout", function (d) {
            this.classList.remove("hovered");
            div.style("opacity", 0.0);
        }); 


    // Render x axis to show months
    d3.select('#js-months').selectAll('svg.months')
        .enter()
        .append('svg')
        .data([1])
        .enter()
        .append('svg')
        .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
                    +(40).toString()+"")
        .append('g')
        .attr('transform', 'translate(0,20)')
        .selectAll('.month')
        .data(() => d3.range(12))
        .enter()
        .append('text')
        .attr('x', (d) => d * (4.5 * CELL_SIZE) + dx)
        .attr('class', 'text-month')
        .text((d) => `${d3.timeFormat('%m')(new Date(0, d + 1, 0))}月`);

    // Render the grid color legend.


    var legendSvg = d3.select('#js-legend').selectAll('svg.legend')
        .enter()
        .append('svg')
        .data([1])
        .enter()
        .append('svg')
        .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
                    +(20 + margin.top + margin.bottom).toString()+"")
        .append('g')
        .attr('transform', `translate(${(width + margin.left + margin.right)/2-7*CELL_SIZE},${0})`)
        .selectAll('.legend-grid')
        .data(() => d3.range(14))
        .enter()
        .append('rect')
        .attr('width', CELL_SIZE)
        .attr('height', CELL_SIZE)
        .attr('x', (d) => d * CELL_SIZE)
        .attr('class', (d) => `day color${Math.floor(d/7)}-${(d<7)?(5-d):(d%7 - 1)}`);

    var legend_x = d3.scaleLinear()
        .domain([-7, 7])
        .rangeRound([0, CELL_SIZE*14]);

    var axis_text = ['万', '千', '百', '十', '个', '角', '角', '个', '十', '百', '千', '万'];
    var tick_scales = [-6.5, -5.5, -4.5, -3.5, -2.5, -1.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5]
    var xAxis = d3.axisBottom(legend_x)
        .tickValues(tick_scales)
        .tickFormat((d, i) => {
            var exp = axis_text[i];
            return `${exp}`;
        });

    var viewBox = d3.select('#js-legend').selectAll('svg')
    viewBox.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(${(width + margin.left + margin.right)/2-7*CELL_SIZE},${CELL_SIZE})`)
        .call(xAxis)

}

function updateHeatmap(data, startYear, endYear) {
    title_year = d3.select('.text-year');
    title_year.text(startYear);
    var dates = data.dates;
    var upBound = 0;
    dates.forEach((d) => {
        d.count = 0;
        d.income = 0;
        d.outcome = 0;
        for (c = 0; c<CATEGORY.length;c++){
            if(c<=7 && CURR_CLASS.indexOf(c) != -1){
                d.income += d[CATEGORY[c]];
            }
            else if(c > 7 && CURR_CLASS.indexOf(c) != -1){
                d.outcome += d[CATEGORY[c]];
            }
        }
        d.count = d.income - d.outcome;
        upBound = Math.max(upBound, Math.abs(d.count));
    });

    var gridClass = 'js-date-grid day';
    var formatColor = d3.scaleQuantize()
        .domain([0, 5])
        .range(d3.range(NUMBER_OF_COLORS)
            .map((d) => `color0-${d}`));
    //console.log(data.maxCount[CURR_CLASS])

    var formatColorOutcome = d3.scaleQuantize()
        .domain([0, 5])
        .range(d3.range(NUMBER_OF_COLORS)
            .map((d) => `color1-${d}`));

    grid = d3.selectAll('#js-heatmap .day').data(dates);
    grid.exit().remove();
    grid = grid.enter()
            .append('rect')
            .attr('width', CELL_SIZE)
            .attr('height', CELL_SIZE)
        .merge(grid)
            .attr('x', (d) => d3.timeFormat('%U')(new Date(d.date)) * CELL_SIZE)
            .attr('y', (d) => (new Date(d.date)).getDay() * CELL_SIZE)
            .attr('class', function (d) {
                // console.log(d.count)
                if (upBound == 0 || d.count == 0)
                    return `${gridClass} #eee`
                else if (d.count > 0)
                    return `${gridClass} ${formatColor(Math.log10(d.count))}`
                else if (d.count < 0){
                    // console.log(d.count);
                    // console.log(formatColorOutcome(Math.log10(-d.count)));
                    return `${gridClass} ${formatColorOutcome(Math.log10(-d.count))}`
                }
            })
            ;
}


