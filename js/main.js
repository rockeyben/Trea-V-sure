// 'count' means total sum of all classes
var CATEGORY = [];

var NAME_DICT = {};
var CATEGORY_COLOR = [];
var CURR_CLASS = [];
var CELL_SIZE = 20;
var NUMBER_OF_COLORS = 6;
var START_YEAR = 2010;
var END_YEAR = 2022;
var CURR_YEAR = 2015;
var SELECT_ALL = false;
var CLEAN_ALL = false;

var IS_SELECTING = 0;
var STACK_START_DATE = new Date(2015, 0, 10);
var STACK_END_DATE = new Date(2015, 0, 30);
var CURR_DATE = new Date(2015, 0, 1);
var ALL_DATA = [];
addData("./data/alipay_record_20191226_1649_1.csv", "mx");

