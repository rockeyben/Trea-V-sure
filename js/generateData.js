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