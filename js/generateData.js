function randomData(year) {
    var maxCount = 0;
    var dateTable = [];

    var format = d3.timeFormat('%Y-%m-%d');
    var cur_date = new Date(year, 0, 1);
    var end_date = new Date(year+1, 0, 1);
    var maxCount = [];
    for(c = 0; c < CATEGORY.length; c++){
        maxCount.push(0);
    }

    while (end_date > cur_date){
        if (Math.random() < 1){
            date = format(cur_date);
            info = {};
            info['date'] = date;
            info['count'] = 0;
            info['records'] = [];

            for (c = 1; c < CATEGORY.length; c++) {
                info[CATEGORY[c]] = 0;
                for (t = 0; t < Math.floor(Math.random() * 10); t++) {
                    var buy = 'Random shopping #' + Math.ceil(Math.random() * 1000);
                    var seller = 'Jacky Chan #' + Math.ceil(Math.random() * 1000);
                    //console.log(buy, seller)
                    var expense = Math.ceil(Math.random() * 1000);
                    
                    info[CATEGORY[c]] += expense;
                    //console.log(info[CATEGORY[c]]);
                    info['records'].push({
                        'name': buy,
                        'expense': expense,
                        'seller': seller,
                        'category': c
                    })
                }
                
                info['count'] += info[CATEGORY[c]];
                maxCount[c] = Math.max(maxCount[c], info[CATEGORY[c]]);
            }
            //console.log(info['records'])
            maxCount[0] = Math.max(maxCount[0], info[CATEGORY[0]]);
            //console.log(info.count);
            dateTable.push(info);
        }
        else{
            date = format(cur_date);
            info = {};
            info['date'] = date;
            info['count'] = 0;
            for (c = 0; c < CATEGORY.length; c++) {
                info[CATEGORY[c]] = 0;
            }
            dateTable.push(info);
        }
        cur_date.setDate(cur_date.getDate()+1);
    }

    return {
        startDate: new Date(year, 0, 1),
        dates: dateTable,
        maxCount
    };
}

function  emptyData(year) {
    var maxCount = 0;
    var dateTable = [];
    var format = d3.timeFormat('%Y-%m-%d');
    var cur_date = new Date(year, 0, 1);
    var end_date = new Date(year + 1, 0, 1);
    var maxCount = [];
    for (c = 0; c < CATEGORY.length; c++) {
        maxCount.push(0);
    }
    while (end_date > cur_date) {
        date = format(cur_date);
        info = {};
        info['date'] = date;
        info['records'] = [];
        for(c = 0; c < CATEGORY.length; c++){
            info[CATEGORY[c]] = 0;
        }
        //maxCount[0] = Math.max(maxCount[0], info[CATEGORY[0]]);
        dateTable.push(info);
        //console.log(cur_date, end_date)
        cur_date.setDate(cur_date.getDate() + 1);
    }

    return {
        startDate: new Date(year, 0, 1),
        dates: dateTable,
        maxCount
    };
}

function processData(raw_data){

    ALL_DATA = [];
    START_YEAR = 10000;
    END_YEAR = 0;

    for (i = 0; i < raw_data.length; i++) {
        var date = raw_data[i].time;
        var year = date.getFullYear();
        
        START_YEAR = Math.min(START_YEAR, year);
        END_YEAR = Math.max(END_YEAR, year);
        //console.log(START_YEAR, END_YEAR);
    }
    CURR_YEAR = START_YEAR;

    STACK_START_DATE = new Date(CURR_YEAR, 0, 1);
    STACK_END_DATE = new Date(CURR_YEAR, 11, 31);//11其实表示12月，12月有31天。
    CURR_DATE = new Date(CURR_YEAR, 0, 1);
    // console.log(START_YEAR, END_YEAR);
    for (j = START_YEAR; j <= END_YEAR; j++){
        // console.log(j)
        ALL_DATA.push(emptyData(j));
    }



    //console.log(ALL_DATA)
    for (i = 0; i < raw_data.length; i++){
        record = raw_data[i];
        var date = record.time;
        var year = date.getFullYear();
        var index = date2index(date);
        
        var info = ALL_DATA[year - START_YEAR].dates[index];
        info['records'].push(record);
        var cat = record.dealCat;
        info[cat] += record.value;
        var cIndex = CATEGORY.indexOf(cat);
        info['income'] = 0;
        info['outcome'] = 0;
        //console.log(record.dealType == "收入")
        if(record.dealType == "收入"){
            info['income'] += record.value;
        }
        else{
            info['outcome'] += record.value;
        }
        
        ALL_DATA[year - START_YEAR].maxCount[cIndex] = Math.max(ALL_DATA[year - START_YEAR].maxCount[cIndex], info[cat]); 
        
        // update ALL_DATA array
        //console.log(year, START_YEAR)
        ALL_DATA[year - START_YEAR].dates[index] = info;
    }
}


function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    let rgb = `rgb(${r},${g},${b})`;
    return rgb;
}

function updateCategory(cats){
    //console.log(cats);
    for (var Bkey in cats) {
        var item = cats[Bkey];
        for (var Skey in item) {
            var cat_name = Skey.split("-")[0];
            if (CATEGORY.indexOf(cat_name) == -1)
                CATEGORY.push(cat_name);
        }
    }
    //console.log(CATEGORY);
    CATEGORY.forEach(function (d, i) {
        NAME_DICT[d] = d;
    })

    CATEGORY_COLOR = ['rgb(199, 233, 180)'];

    //console.log(CATEGORY_COLOR);
    //console.log(NAME_DICT)

}