function randomData() {
    var maxCount = 0;
    var dateTable = {};

    var format = d3.timeFormat('%Y-%m-%d');
    var cur_date = new Date('2015-1-1');
    var end_date = new Date('2016-1-1');
    while (end_date > cur_date){
        date = format(cur_date);
        dateTable[date] = {count: Math.ceil(Math.random() * 1000)};
        dateTable[date]['food'] = 1;
        maxCount = Math.max(maxCount, dateTable[date].count);
        cur_date.setDate(cur_date.getDate()+1);
    }

    return {
        startDate: new Date('2015-1-1'),
        dates: dateTable,
        maxCount
    };
}