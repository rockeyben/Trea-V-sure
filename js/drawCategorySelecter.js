function drawCategorySelecter(){
    var dx = 20;
    var button_size = 50;
    var width = (button_size + dx)* CATEGORY.length;
    var height = button_size;
    var selecterSvg = d3.select('#category-selecter')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')

    var selecterRects =  selecterSvg.selectAll('g')
        .data(() => d3.range(CATEGORY.length))
        .enter()
        .append('rect')
        .attr('width', button_size)
        .attr('height', button_size)
        .attr('x', (d) => (button_size + dx) * d)
        .attr('y', 0)
        .attr('class', (d) => `color${d}-3`)
        .on('click', function (d) {
            CURR_CLASS = d;
            updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);
        })
        
    var texts = selecterSvg.selectAll('g')
        .data(() => d3.range(CATEGORY.length))
        .enter()
        .append('text')
        .text(function (d) {
            return NAME_DICT[CATEGORY[d]];
        })
        .attr('x', (d) => (button_size + dx) * d + 5)
        .attr('y', 0)
        .attr('dy', button_size-10)
        .attr('class', 'text-category')
        .on('click', function (d) {
            CURR_CLASS = d;
            updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);
        })
}