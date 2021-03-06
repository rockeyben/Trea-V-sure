
function drawCategorySelecter(){

    d3.select('#category-selecter').append('p');
    d3.select('#category-selecter > p').selectAll('p').data(() => d3.range(CATEGORY.length + 2)).enter()
        .append('div')
        .attr('class','btn btn-sm')
        .attr('id',(d,i)=>{return`category-selecter-btn-${i}`})
        .text(function (d) {
            if (d < CATEGORY.length)
                return NAME_DICT[CATEGORY[d]];
            else if (d == CATEGORY.length)
                return "全选";
            else if (d == CATEGORY.length + 1)
                return "清空";
        })
        .on('click', function (d) {
            if (d < CATEGORY.length){
                updateCurrClass(d);
                //console.log(CURR_CLASS)
                if (CURR_CLASS.indexOf(d) != -1) {
                    d3.select(this)
                        .classed("btn-light", false);
                    d3.select(this)
                        .classed("btn-success", true);
                    // console.log(this);
                }
                else {
                    d3.select(this)
                        .classed('btn-light', true);
                    d3.select(this)
                        .classed("btn-success", false);
                    // console.log(this);
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
                d3.selectAll('#category-selecter > p > div.btn')
                    .classed('btn-light', true);
                d3.selectAll('#category-selecter > p > div.btn')
                    .classed("btn-success", false);
                updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);
                updateStackChart();
            }
        })

}


function selectAllCategory() {
    CURR_CLASS = [];
    for (cc = 0; cc < CATEGORY.length; cc++)
        CURR_CLASS.push(cc);
    // console.log(d3.selectAll('#category-selecter > p > div.btn'));
    d3.selectAll('#category-selecter > p > div.btn')
        .classed('btn-success', (d) => (d < CATEGORY.length) ? true : false );
    d3.selectAll('#category-selecter > p > div.btn')
        .classed('btn-light', (d) => (d < CATEGORY.length) ? false : true );
    //console.log(CURR_CLASS);
    updateHeatmap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);
    updateStackChart();
}


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
                    .text('请在图中点击');
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

