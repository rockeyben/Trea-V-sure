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
        .attr('data-toggle', 'tooltip')
        // Add the grid data as a title attribute to render as a tooltip.
        .attr('title', (d) => {
            var date = d3.timeFormat('%b %d, %Y')(new Date(d.date));
            if (!d || !d[CATEGORY[CURR_CLASS]]) return `No money on ${date}`;
            else if (d[CATEGORY[CURR_CLASS]] === 1) return `spend 1 RMB on ${date}`;
            else return `spend ${d[CATEGORY[CURR_CLASS]]} RMB on ${date}`;
        })
        .attr('date', (d) => d.date)
        // Add bootstrap's tooltip event listener.
        .call(() => $('[data-toggle="tooltip"]').tooltip({
            container: '#the-article',
            placement: 'top',
            position: { my: 'top' }
        }))
        // Add the colors to the grids.
        .attr('class', (d) => `${gridClass} ${formatColor(d[CATEGORY[CURR_CLASS]])}`)

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
        .attr('title', (d) => {
            var date = d3.timeFormat('%b %d, %Y')(new Date(d.date));
            if (!d || !d[CATEGORY[CURR_CLASS]]) return `No money on ${date}`;
            else if (d[CATEGORY[CURR_CLASS]] === 1) return `spend 1 RMB on ${date}`;
            else return `spend ${d[CATEGORY[CURR_CLASS]]} RMB on ${date}`;
        })
        .attr('class', (d) => `${gridClass} ${formatColor(d[CATEGORY[CURR_CLASS]])}`);

    var legendSvg = d3.select('#js-legend')
        .selectAll('rect')
        .data(() => d3.range(7))
        .attr('class', (d) => `day color${CURR_CLASS}-${d - 1}`);
}
