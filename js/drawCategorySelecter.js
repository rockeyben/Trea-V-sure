function drawCategorySelecter(){
    var dx = 20;
    var button_size = 50;
    var columns = 5;
    var width = (button_size*2 + dx)* columns;
    var height = (button_size + dx) * (Math.floor(CATEGORY.length/columns) + 1);
    var selecterSvg = d3.select('#category-selecter')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')

    var selecterRects =  selecterSvg.selectAll('g')
        .data(() => d3.range(CATEGORY.length + 2))
        .enter()
        .append('rect')
        .attr('width', button_size)
        .attr('height', button_size)
        .attr('x', (d) => (button_size*2 + dx) * (d % columns))
        .attr('y', (d) => (button_size + dx) * (Math.floor(d / columns)) )
        .style('fill', '#eee')
        .on('click', function (d) {
            if (d < CATEGORY.length){
                updateCurrClass(d);
                //console.log(CURR_CLASS)
                if (CURR_CLASS.indexOf(d) != -1) {
                    d3.select(this)
                        .style("fill", CATEGORY_COLOR[0]);
                }
                else {
                    d3.select(this)
                        .style('fill', '#eee');
                }
                updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);
                updateStackChart();
            }
            else if(d == CATEGORY.length){
                // select all
                CURR_CLASS = [];
                for(cc = 0; cc < CATEGORY.length; cc++)
                    CURR_CLASS.push(cc);
                var all_rects = d3.select("#category-selecter").selectAll("rect");
                all_rects.style('fill', (d)=>{
                    //console.log(d);
                    if (d < CATEGORY.length)
                        return CATEGORY_COLOR[0];
                    else
                        return '#eee';                    
                })
                //console.log(CURR_CLASS);
                updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);
                updateStackChart();
            }
            else if(d == CATEGORY.length + 1){
                // clean all
                CURR_CLASS = [];
                var all_rects = d3.select("#category-selecter").selectAll("rect");
                all_rects.style('fill', (d) => {
                    //console.log(d);
                    return '#eee';
                })
                updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);
                updateStackChart();
            }
            
        })
        .on("mouseover", function (d) {
            d3.select(this)
                .style("fill", CATEGORY_COLOR[0]);
        })
        .on("mouseout", function (d) {
            //console.log(CURR_CLASS, d)
            if(CURR_CLASS.indexOf(d) == -1){
                d3.select(this)
                    .style('fill', '#eee');
            }
        });

        
    var texts = selecterSvg.selectAll('g')
        .data(() => d3.range(CATEGORY.length + 2))
        .enter()
        .append('text')
        .text(function (d) {
            if (d < CATEGORY.length)
                return NAME_DICT[CATEGORY[d]];
            else if (d == CATEGORY.length)
                return "全选";
            else if (d == CATEGORY.length + 1)
                return "清空";
        })
        .attr('x', (d) => (button_size*2 + dx) * (d % columns) + 5)
        .attr('y', (d) => (button_size + dx) * (Math.floor(d / columns)))
        .attr('dy', button_size-10)
        .attr('class', 'text-category')

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

function updateColor() {
    
}
