function date2index(date){
    /*
        date is a new Date() object
    */
   var year = date.getFullYear();
   var s_year = new Date(year, 0, 1);
   var index = (date.getTime() - s_year.getTime()) / (1000 * 3600 * 24);
   return Math.floor(index);
}