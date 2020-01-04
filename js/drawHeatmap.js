function createHeatMap(data, startYear, endYear) {
    // var width = $(".results").width();
    var width = CELL_SIZE * 56;
    var height = CELL_SIZE * 7;
    var margin = {top: 10, right: 10, bottom: 10, left: 10};
    var dx = 35;
    var gridClass = 'js-date-grid day';
    var formatColor = d3.scaleQuantize()
        .domain([0, data.maxCount[CURR_CLASS]])
        .range(d3.range(NUMBER_OF_COLORS)
        .map((d) => `color${CURR_CLASS}-${d}`));


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

    var dates = data.dates;
    rect.selectAll('.day')
        // The heatmap will contain all the days in that year.
        .data(dates)
        .enter()
        .append('rect')
        .attr('class', gridClass)
        .attr('width', CELL_SIZE)
        .attr('height', CELL_SIZE)
        .attr('x', (d) => d3.timeFormat('%U')(new Date(d.date)) * CELL_SIZE)
        .attr('y', (d) => (new Date(d.date)).getDay() * CELL_SIZE)
        .attr('date', (d) => d.date)
        // Add the colors to the grids.
        .attr('class', (d) => `${gridClass} ${formatColor(d[CATEGORY[CURR_CLASS]])}`)
        .on('click', function (d) {
            console.log(IS_SELECTING)
            if(IS_SELECTING == 1){
                STACK_START_DATE = new Date(d.date);
                IS_SELECTING += 1;
                updateDateText1();
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
                IS_SELECTING = 0;
            }

            CURR_DATE = new Date(d.date);
            updateRecordList();
        })
        .on('mouseover', function (d) {
            var timeFormat = d3.timeFormat('%Y-%m-%d');
            //console.log(d.date)
            div.transition()
                .style('opacity', .9);
            div.html("<span id='tooltip' style='color: black'>" + d.date + "</span></br></br>" +
                "<span id='tooltip' style='color: black'>Total:" + d.count + "</span></br>" +
                "<span id='tooltip' style='color: black'>Food:" + d.food + "</span></br>" +
                "<span id='tooltip' style='color: black'>Clothes:" + d.clothes + "</span></br>" +
                "<span id='tooltip' style='color: black'>Living:" + d.living + "</span></br>" +
                "<span id='tooltip' style='color: black'>Transport:" + d.transport + "</span>"
                ) 
                .style('left', (d3.event.pageX+20)+'px')
                .style('top', (d3.event.pageY+20)+'px')
        })
        .on("mouseout", function (d) {
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
                    +(40 + margin.top + margin.bottom).toString()+"")
        .append('g')
        .attr('transform', 'translate(0,20)')
        .selectAll('.month')
        .data(() => d3.range(12))
        .enter()
        .append('text')
        .attr('x', (d) => d * (4.5 * CELL_SIZE) + dx)
        .attr('class', 'text-month')
        .text((d) => d3.timeFormat('%b')(new Date(0, d + 1, 0)));

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
        .attr('transform', 'translate(0,0)')
        .selectAll('.legend-grid')
        .data(() => d3.range(7))
        .enter()
        .append('rect')
        .attr('width', CELL_SIZE)
        .attr('height', CELL_SIZE)
        .attr('x', (d) => d * CELL_SIZE + dx)
        .attr('class', (d) => `day color${CURR_CLASS}-${d - 1}`);

}

function updateHeatmap(data, startYear, endYear) {
    title_year = d3.select('.text-year');
    title_year.text(startYear);

    var gridClass = 'js-date-grid day';
    var formatColor = d3.scaleQuantize()
        .domain([0, data.maxCount[CURR_CLASS]])
        .range(d3.range(NUMBER_OF_COLORS)
            .map((d) => `color${CURR_CLASS}-${d}`));

    grid = d3.selectAll('.day').data(data.dates)
        .attr('x', (d) => d3.timeFormat('%U')(new Date(d.date)) * CELL_SIZE)
        .attr('y', (d) => (new Date(d.date)).getDay() * CELL_SIZE)
        .attr('class', (d) => `${gridClass} ${formatColor(d[CATEGORY[CURR_CLASS]])}`);

    var legendSvg = d3.select('#js-legend')
        .selectAll('rect')
        .data(() => d3.range(7))
        .attr('class', (d) => `day color${CURR_CLASS}-${d - 1}`);
}
