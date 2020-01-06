function drawRecordList(){
    var index = date2index(CURR_DATE);
    var year = CURR_DATE.getFullYear();
    var info = ALL_DATA[year-START_YEAR].dates[index];
    console.log(info);

    var data = info['records'];
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
        .attr('id', 'date_text_3')

    var sortValueAscending = function (a, b) { return a.expense - b.expense }
    var sortValueDescending = function (a, b) { return b.expense - a.expense }
    var sortNameAscending = function (a, b) { return a.name.localeCompare(b.name); }
    var sortNameDescending = function (a, b) { return b.name.localeCompare(a.name); }
    var sortCategoryAscending = function (a, b) { return a.category - b.category }
    var sortCategoryDescending = function (a, b) { return b.category - a.category }
    var metricAscending = true;
    var nameAscending = true;
    var categoryAscending = true;

    var columns = ["name (Sort)", "seller", "category (Sort)", "expense (Sort)"]

    dimensions = {"width": $('#record-list').width(), "height": $('#record-list').height()};

    var width = dimensions.width + "px";
    var height = dimensions.height + "px";
    var twidth = (dimensions.width - 25) + "px";
    var divHeight = (dimensions.height - 60) + "px";

    var outerTable = d3.select("#record-list").append("table");

    outerTable.append("tr").append("td")
        .append("table").attr("class", "headerTable").attr("width", twidth)
        .append("tr").selectAll("th").data(columns).enter()
        .append("th").text(function (column) { return column; })
        .on("click", function (d) {
            // Choose appropriate sorting function.
            if (d === columns[3]) {
                var sort = metricAscending ? sortValueAscending : sortValueDescending;
                metricAscending = !metricAscending;
                var rows = tbody.selectAll("tr").sort(sort);
            } else if (d === columns[0]) {
                var sort = nameAscending ? sortNameAscending : sortNameDescending
                nameAscending = !nameAscending;
                var rows = tbody.selectAll("tr").sort(sort);
            }
            else if (d === columns[2]) {
                var sort = categoryAscending ? sortCategoryAscending : sortCategoryDescending
                categoryAscending = !categoryAscending;
                var rows = tbody.selectAll("tr").sort(sort);
            }
        });

    var inner = outerTable.append("tr").append("td")
        .append("div").attr("class", "scroll").attr("width", width).attr("style", "height:" + divHeight + ";")
        .append("table").attr("class", "bodyTable").attr("border", 1).attr("width", twidth).attr("height", height).attr("style", "table-layout:fixed");

    var tbody = inner.append("tbody");
    // Create a row for each object in the data and perform an intial sort.
    var rows = tbody.selectAll("tr").data(data).enter().append("tr").sort(sortValueDescending);

    // Create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function (d) {
            return columns.map(function (column) {
                return { column: column, 
                        name: d.name, 
                        seller: d.seller,
                        category: d.category,
                        expense:d.expense };
            });
        }).enter().append("td")
        .text(function (d) {
            if (d.column === columns[0]) return d.name;
            else if (d.column === columns[3]) return d.expense;
            else if (d.column == columns[1]) return d.seller;
            else if (d.column == columns[2]) return CATEGORY[d.category];
        });
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