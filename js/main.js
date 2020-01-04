// 'count' means total sum of all classes
var CATEGORY = ['count', 'food', 'clothes', 'living', 'transport'];
var NAME_DICT = {
    'count' : '总',
    'food' : '食',
    'clothes' : '衣',
    'living' : '住',
    'transport' : '行',
}
var CATEGORY_COLOR = ['#1e6823', '#FB6A4A',
    '#41B6C4', '#8C96C6', '#FE9929']
var CURR_CLASS = 1;
var CELL_SIZE = 20;
var NUMBER_OF_COLORS = 6;
var START_YEAR = 2010;
var END_YEAR = 2019;
var CURR_YEAR = 2015;

var IS_SELECTING = 0;
var STACK_START_DATE = new Date(2015, 0, 10);
var STACK_END_DATE = new Date(2015, 0, 30);
var CURR_DATE = new Date(2015, 0, 1);
var ALL_DATA = [];

// initial data
// Random
for (i = START_YEAR; i < END_YEAR; i++){
    ALL_DATA.push(randomData(i));
}

drawSlider(START_YEAR, END_YEAR);
drawCategorySelecter();
drawDateSelecter();
drawStackChart(ALL_DATA[0].dates.slice(10, 30), [1, 2, 3, 4]);

//console.log(data.dates);
createHeatMap(ALL_DATA[CURR_YEAR-START_YEAR], CURR_YEAR, CURR_YEAR+1);

drawRecordList();