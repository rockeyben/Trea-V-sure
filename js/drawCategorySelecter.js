function drawCategorySelecter(){
    var dx = 20;
    var button_width = 70;
    var button_height = 50;
    var columns = 6;
    var width = (button_width*2 + dx)* columns;
    var height = (button_width + dx) * (Math.floor(CATEGORY.length/columns) + 1);
    var margin = { top: 20, right: 20, bottom: 20, left: 20 };
    var selecterSvg = d3.select('#category-selecter')
        .append('svg')
        .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
                    +(height + margin.top + margin.bottom).toString()+"")
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var selecterRects =  selecterSvg.selectAll('g')
        .data(() => d3.range(CATEGORY.length + 2))
        .enter()
        .append('rect')
        .attr('width', button_width)
        .attr('height', button_height)
        .attr('x', (d) => (button_width*2 + dx) * (d % columns))
        .attr('y', (d) => (button_height + dx) * (Math.floor(d / columns)) )
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
                selectAllCategory();
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
        .attr('x', (d) => (button_width*2 + dx) * (d % columns) + 5)
        .attr('y', (d) => (button_height + dx) * (Math.floor(d / columns)))
        .attr('dy', button_height-10)
        .attr('class', 'text-category')

}

function selectAllCategory() {
    CURR_CLASS = [];
    for (cc = 0; cc < CATEGORY.length; cc++)
        CURR_CLASS.push(cc);
    var all_rects = d3.select("#category-selecter").selectAll("rect");
    all_rects.style('fill', (d) => {
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

// function drawDateSelecter(){
//     var dx = 20;
//     var button_height = 50;
//     var button_width = 80*2;

//     var width = (button_width + dx) * 2,
//         height= button_height,
//         margin= {top: 12, right: 12, bottom:12, left:12};
//     var selecterSvg = d3.select('#date-selecter')
//         .append('svg')
//         .attr("viewBox", "0,0,"+(width + margin.left + margin.right).toString()+","
//                     +(height + margin.top + margin.bottom).toString()+"")
//         .append('g')

//     var selecterRects = selecterSvg.selectAll('g')
//         .data(() => d3.range(1))
//         .enter()
//         .append('rect')
//         .attr('width', button_width)
//         .attr('height', button_height)
//         .attr('x', (d) => (button_width + dx) * d)
//         .attr('y', 0)
//         .style('fill', 'gray')
//         .on('click', function (d) {
//             // select button
//             if (IS_SELECTING == 0){
//                 IS_SELECTING = 1;
//                 var text1 = d3.select('#date_text_1');
//                 text1.text('click twice on heatmap')
//                 var text2 = d3.select('#date_text_2');
//                 text2.text('')
//             }
//             else{
//                 IS_SELECTING = 0;
//             }
//         })
//         .on("mouseover", function (d) {
//             d3.select(this)
//             .style("fill", "black");
//         })
//         .on("mouseout", function (d) {
//             d3.select(this)
//             .style("fill", "gray");
//         }
//         );

//     var texts = selecterSvg.selectAll('g')
//         .data(() => d3.range(1))
//         .enter()
//         .append('text')
//         .text(function (d) {
//             if (d==0)
//                 return 'select';
//         })
//         .attr('x', (d) => (button_width + dx) * d + 5)
//         .attr('y', 0)
//         .attr('dy', button_height - 10)
//         .attr('class', 'text-category')

    
//     var date_texts_1 = selecterSvg.selectAll('g')
//         .data(() => d3.range(1))
//         .enter()
//         .append('text')
//         .text(d3.timeFormat('%Y-%m-%d')(STACK_START_DATE))
//         .attr('x', (d) => (button_width + dx) * (d + 1.5) + 5)
//         .attr('y', 0)
//         .attr('dy', button_height - 10)
//         .attr('class', 'text-stack-year')
//         .attr('id', 'date_text_1')

//     var date_texts_2 = selecterSvg.selectAll('g')
//         .data(() => d3.range(1))
//         .enter()
//         .append('text')
//         .text(d3.timeFormat('%Y-%m-%d')(STACK_END_DATE))
//         .attr('x', (d) => (button_width + dx) * (d + 2.5) + 5)
//         .attr('y', 0)
//         .attr('dy', button_height - 10)
//         .attr('class', 'text-stack-year')
//         .attr('id', 'date_text_2')
// }

function drawDateSelecter(){

    // d3.select('#date-selecter *').remove();
    d3.select('#date-selecter').append('p').append('div')
        .attr('class','btn  btn-info')
        .attr('id','date-selecter-btn')
        .text("选择时间范围")
        .on('click', function (d) {
            // select button
            if (IS_SELECTING == 0){
                IS_SELECTING = 1;
                d3.select('#date-selecter-btn')
                    .text('请在图中点击开始日期');
                d3.select('#date_text_1')
                    .text('开始：[请在图中点击开始日期]；');
                d3.select('#date_text_2')
                    .text('结束：[待稍后选择]。');
            }
            else{
                IS_SELECTING = 0;
            }
        })
        ;
    d3.select('#date-selecter').append('p').attr('id','date_text_p');
    d3.select('#date_text_p').append('span').attr('id','date_text_1')
        .text(`开始：${d3.timeFormat('%Y-%m-%d')(STACK_START_DATE)}；`);
    d3.select('#date_text_p').append('span').attr('id','date_text_2')
        .text(`结束：${d3.timeFormat('%Y-%m-%d')(STACK_END_DATE)}。`);

}

function updateDateText1(){
    d3.select('#date_text_1').text(`开始：${d3.timeFormat('%Y-%m-%d')(STACK_START_DATE)}；`);
    d3.select('#date_text_2').text("结束：[请在图中点击结束日期]。");
}

function updateDateText2() {
    d3.select('#date_text_2').text(`结束：${d3.timeFormat('%Y-%m-%d')(STACK_END_DATE)}。`);
    d3.select('#date-selecter-btn').text("重选时间范围");
}