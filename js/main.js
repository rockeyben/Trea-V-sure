// 'count' means total sum of all classes
var CATEGORY = ['count', 'food', 'clothes', 'living', 'transport'];
var NAME_DICT = {
    'count' : '总',
    'food' : '食',
    'clothes' : '衣',
    'living' : '住',
    'transport' : '行',
}
var CURR_CLASS = 1;
var CELL_SIZE = 20;
var NUMBER_OF_COLORS = 6;
var START_YEAR = 2010;
var END_YEAR = 2019;
var CURR_YEAR = 2015;
var ALL_DATA = [];

// initial data
// Random
for (i = START_YEAR; i < END_YEAR; i++){
    ALL_DATA.push(randomData(i));
}

drawSlider(START_YEAR, END_YEAR);
drawCategorySelecter();
//console.log(data.dates);
createHeatMap(ALL_DATA[CURR_YEAR-START_YEAR], CURR_YEAR, CURR_YEAR+1);