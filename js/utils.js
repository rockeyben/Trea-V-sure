function date2index(date){
    /*
        date is a new Date() object
    */
   var year = date.getFullYear();
   var month = date.getMonth();
   var day = date.getDate();
   var curr = new Date(year, month, day);
   var s_year = new Date(year, 0, 1);
   var index = (curr.getTime() - s_year.getTime()) / (1000 * 3600 * 24);
   return Math.floor(index);
}