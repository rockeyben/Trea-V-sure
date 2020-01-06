// d.time               参考时间，用来在时间轴上定位，大部分是支付时间，少数是订单发生时间
// d.trader             交易对方
// d.goodName           商品名称
// d.dealType           是收入还是支出
// d.dealCat            主分类
// d.dealCatSub         次分类
// d.value              金额
// d.user

function drawRecordList(){
    var index = date2index(CURR_DATE);
    var year = CURR_DATE.getFullYear();
    var info = ALL_DATA[year-START_YEAR].dates[index];
    console.log(info);

    var data = info['records'];
    /*
    var selecterSvg = d3.select("#record-list") 
        .append('svg')
        .attr('width', $('#record-list').width())
        .attr('height', 50)
        .append('g')
    var date_texts_3 = selecterSvg.selectAll("g")
        .data(() => d3.range(1))
        .enter()
        .append('text')
        .text("Current Date:" + d3.timeFormat('%Y-%m-%d')(CURR_DATE))
        .attr('x', (d) => 30)
        .attr('y', 0)
        .attr('dy', 50 - 10)
        .attr('class', 'text-stack-year')
        .attr('id', 'date_text_3')*/

    columns = [{text: '交易时间', sort: TableSort.numeric, sort_column:true},
        { text: '交易对方', sort: TableSort.alphabetic, sort_column: true},
        { text: '商品名称', sort: TableSort.alphabetic, sort_column: true},
        { text: '收入/支出', sort: TableSort.alphabetic, sort_column: true},
        { text: '主分类', sort: TableSort.alphabetic, sort_column: true},
        { text: '次分类', sort: TableSort.alphabetic, sort_column: true},
        { text: '金额', sort: TableSort.numeric, sort_column: true},
        { text: '用户', sort: TableSort.alphabetic, sort_column: true}]
    
    var data_array = [];
    
    info.records.forEach((d) => {
        data_array.push([d.timePurchased, d.trader, d.goodName, d.dealType, d.dealCat, d.dealCatSub, d.value, d.user]);
    });

    console.log(data_array)

    var dimensions = { width: $('#record-list').width(), height: '700px' };

    TableSort('#record-list', columns, data_array, dimensions);
}

function removeRecordList() {
    var recordList = d3.select("#record-list").selectAll("table");
    recordList.remove();
    var recordList = d3.select("#record-list").selectAll("svg");
    recordList.remove();
}


function updateRecordList() {
    removeRecordList();
    drawRecordList();
}