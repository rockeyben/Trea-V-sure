function drawSlider(start_year, end_year){

    var dataTime = d3.range(0, end_year-start_year).map(function (d) {
        return new Date(start_year + d, 10, 3);
    });

    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(dataTime))
        .max(d3.max(dataTime))
        .step(1000 * 60 * 60 * 24 * 365)
        .width(300)
        .tickFormat(d3.timeFormat('%Y'))
        .tickValues(dataTime)
        .default(new Date(CURR_YEAR, 1, 1))
        .on('onchange', val => {
            //d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            year = parseInt(d3.timeFormat('%Y')(val));
            //console.log(parseInt(year), CURR_YEAR);
            
            if (year!=CURR_YEAR){
                CURR_YEAR = year;
                updateHeatmap(ALL_DATA[CURR_YEAR-START_YEAR], CURR_YEAR, CURR_YEAR+1);
            }
        });

    var gTime = d3
        .select('div#slider-time')
        .append('svg')
        .attr('width', 800)
        .attr('height', 100)
        .append('g')
        .attr('transform', 'translate(80,30)');

    gTime.call(sliderTime);
}