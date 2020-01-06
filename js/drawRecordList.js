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
    // console.log(info);

    var data = info['records'];
    d3.select("#record-list").append('p')
        .text("Current Date:" + d3.timeFormat('%Y-%m-%d')(CURR_DATE))
        .attr('class', 'text-stack-year')
        .attr('id', 'date_text_3')
        ;
    d3.select("#record-list")
        .append('table').attr("id", "record-table").attr("class", "table table-bordered")
        .append('thead')
        .append('tr').attr("class", "tr-head")
        ;
    var thead_tr = d3.select("#record-list > #record-table > thead > tr.tr-head");
    thead_tr.append('th').text(`时间`);
    thead_tr.append('th').text(`交易对方`);
    thead_tr.append('th').text(`内容`);
    thead_tr.append('th').text(`收/支`);
    thead_tr.append('th').text(`父类`);
    thead_tr.append('th').text(`子类`);
    thead_tr.append('th').text(`金额`);
    thead_tr.append('th').text(`用户`);

    d3.select("#record-list > #record-table").append("tbody");

    var data_array = [];
    
    info.records.forEach((d) => {
        data_array.push([d.timePurchased, d.trader, d.goodName, d.dealType, d.dealCat, d.dealCatSub, d.value, d.user]);
    });

    // var dimensions = { width: $('#record-list').width(), height: '700px' };
    // TableSort('#record-list', columns, data_array, dimensions);

    data_array.forEach((d)=>{
        // console.log(d);
        var tr = d3.select("#record-list #record-table tbody").append('tr').attr('class', 'tr-row');
        tr.append('td').text(`${d[0]}`);
        tr.append('td').text(`${d[1]}`);
        tr.append('td').text(`${d[2]}`);
        tr.append('td').text(`${d[3]}`);
        tr.append('td').text(`${d[4]}`);
        tr.append('td').text(`${d[5]}`);
        tr.append('td').text(`${d[6]}`);
        tr.append('td').text(`${d[7]}`);
    })

    var sort_direction=1;
    d3.selectAll('#record-table th').on('click',(e,i)=>{
        console.log(e);
        console.log(i);
        if(sort_direction==1) {
            sort_direction=-1;
        }
        else {
            sort_direction=1;
        }
        // console.log(sort_direction);
        //获得行数组
        var trarr=$('#record-table').find('tbody > tr.tr-row').get();
        //数组排序
        trarr.sort(function(a, b) {
            var col1 = $(a).children('td').eq(i).text().toUpperCase();
            var col2 = $(b).children('td').eq(i).text().toUpperCase();
            if (!isNaN(Number(col1))&&!isNaN(Number(col2))){
              return(Number(col1) < Number(col2)) ? -sort_direction: (Number(col1) > Number(col2)) ? sort_direction: 0;
            }else{
              return(col1 < col2) ? -sort_direction: (col1 > col2) ? sort_direction: 0;
            }
        }
        );
        $.each(trarr, function(i, row) {
            console.log("appending");
            //将排好序的数组重新填回表格
            $('#record-table tbody').append(row);
        }
        );
    }
    );



}

function removeRecordList() {
    d3.select("#record-list").selectAll("table").remove();
    d3.select("#record-list").selectAll("p").remove();
}


function updateRecordList() {
    removeRecordList();
    drawRecordList();
}