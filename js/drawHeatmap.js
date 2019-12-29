function createHeatMap(data, startYear, endYear) {
    // var width = $(".results").width();
    var width = CELL_SIZE * 56;
    var height = CELL_SIZE * 7;
    var margin = {top: 10, right: 10, bottom: 10, left: 10};
    var dx = 35;
    var gridClass = 'js-date-grid day';
    var formatColor = d3.scaleQuantize().domain([0, data.maxCount]).range(d3.range(NUMBER_OF_COLORS).map((d) => `color${d}`));

    var heatmapSvg = d3.select('.js-heatmap').selectAll('svg.heatmap')
        .enter()
        .append('svg')
        .data(d3.range(startYear, endYear))
        .enter()
        .append('svg')
        .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
                    +(height + margin.top + margin.bottom).toString()+"")
        .attr('class', 'color')

    // Add a grid for each day between the date range.
    var dates = Object.keys(data.dates);
    var rect = heatmapSvg.append('g')
        .attr('transform', `translate(${dx},0)`);

    // Add year label.
    rect.append('text')
        .attr('transform', `translate(-9,${CELL_SIZE * 3.5})rotate(-90)`)
        .style('text-anchor', 'middle')
        .attr('class', 'text-year')
        .text((d) => d);

    rect.selectAll('.day')
        // The heatmap will contain all the days in that year.
        .data((d) => d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
        .enter()
        .append('rect')
        .attr('class', gridClass)
        .attr('width', CELL_SIZE)
        .attr('height', CELL_SIZE)
        .attr('x', (d) => d3.timeFormat('%U')(d) * CELL_SIZE)
        .attr('y', (d) => d.getDay() * CELL_SIZE)
        .attr('data-toggle', 'tooltip')
        .datum(d3.timeFormat('%Y-%m-%d'))
        // Add the grid data as a title attribute to render as a tooltip.
        .attr('title', (d) => {
            var countData = data.dates[d];
            var date = d3.timeFormat('%b %d, %Y')(new Date(d));
            if (!countData || !countData.count) return `No money on ${date}`;
            else if (countData.count === 1) return `spend 1 RMB on ${date}`;
            else return `spend ${countData.count} RMB on ${date}`;
        })
        .attr('date', (d) => d)
        // Add bootstrap's tooltip event listener.
        .call(() => $('[data-toggle="tooltip"]').tooltip({
            container: '#the-article',
            placement: 'top',
            position: { my: 'top' }
        }))
        // Add the colors to the grids.
        .filter((d) => dates.indexOf(d) > -1)
        .attr('class', (d) => `${gridClass} ${formatColor(data.dates[d].count)}`)

    // Render x axis to show months
    d3.select('.js-months').selectAll('svg.months')
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
    var legendSvg = d3.select('.js-legend').selectAll('svg.legend')
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
        .attr('class', (d) => `day color${d - 1}`);

}