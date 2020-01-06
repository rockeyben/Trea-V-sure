function drawCategorySelecter(){
    var dx = 20;
    var button_size = 80;
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
        .style('fill', (d) => CATEGORY_COLOR[d])
        .on('click', function (d) {
            CURR_CLASS = d;
            updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);

            if(d != 0)
                updateStackChart();
        })
        .on("mouseover", function (d) {
            d3.select(this)
                .style("fill", "black");
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .style('fill', CATEGORY_COLOR[d]);
        }
        );

        
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
            updateStackChart();
        })

}

function drawDateSelecter(){
    var dx = 20;
    var button_size = 50;
    var button_width = 80*2;
    var width = (button_width + dx) * 2;
    var height = button_size;
    var selecterSvg = d3.select('#date-selecter')
        .append('svg')
        .attr('width', $('#date-selecter').width())
        .attr('height', height)
        .append('g')

    var selecterRects = selecterSvg.selectAll('g')
        .data(() => d3.range(1))
        .enter()
        .append('rect')
        .attr('width', button_width)
        .attr('height', button_size)
        .attr('x', (d) => (button_width + dx) * d)
        .attr('y', 0)
        .style('fill', 'gray')
        .on('click', function (d) {
            // select button
            if (IS_SELECTING == 0){
                IS_SELECTING = 1;
                var text1 = d3.select('#date_text_1');
                text1.text('click twice on heatmap')
                var text2 = d3.select('#date_text_2');
                text2.text('')
            }
            else{
                IS_SELECTING = 0;
            }
        })
        .on("mouseover", function (d) {
            d3.select(this)
            .style("fill", "black");
        })
        .on("mouseout", function (d) {
            d3.select(this)
            .style("fill", "gray");
        }
        );

    var texts = selecterSvg.selectAll('g')
        .data(() => d3.range(1))
        .enter()
        .append('text')
        .text(function (d) {
            if (d==0)
                return 'select';
        })
        .attr('x', (d) => (button_width + dx) * d + 5)
        .attr('y', 0)
        .attr('dy', button_size - 10)
        .attr('class', 'text-category')

    
    var date_texts_1 = selecterSvg.selectAll('g')
        .data(() => d3.range(1))
        .enter()
        .append('text')
        .text(d3.timeFormat('%Y-%m-%d')(STACK_START_DATE))
        .attr('x', (d) => (button_width + dx) * (d + 1.5) + 5)
        .attr('y', 0)
        .attr('dy', button_size - 10)
        .attr('class', 'text-stack-year')
        .attr('id', 'date_text_1')

    var date_texts_2 = selecterSvg.selectAll('g')
        .data(() => d3.range(1))
        .enter()
        .append('text')
        .text(d3.timeFormat('%Y-%m-%d')(STACK_END_DATE))
        .attr('x', (d) => (button_width + dx) * (d + 2.5) + 5)
        .attr('y', 0)
        .attr('dy', button_size - 10)
        .attr('class', 'text-stack-year')
        .attr('id', 'date_text_2')
}

function updateDateText1(){
    var text1 = d3.select('#date_text_1');
    text1.text(d3.timeFormat('%Y-%m-%d')(STACK_START_DATE))
}

function updateDateText2() {
    var text2 = d3.select('#date_text_2');
    text2.text(d3.timeFormat('%Y-%m-%d')(STACK_END_DATE))
}