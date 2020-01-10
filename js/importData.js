
// ============================================================================= //

// 数据结构说明：
// 主要字段（也就是可视化里面可能要用到的字段）：
// d.time               参考时间，用来在时间轴上定位，大部分是支付时间，少数是订单发生时间
// d.tradeType          交易类型
// d.trader             交易对方
// d.goodName           商品名称
// d.dealType           是收入还是支出
// d.dealCat            主分类
// d.dealCatSub         次分类
// d.value              金额
// d.stateTrade         交易状态
// d.tradeID            交易号
// d.orderID            订单号
// d.note               备注
// d.user               用户（导入数据时用户手工输入）
// d.dataSource         数据来源【`alipay`或`wechat`】（导入数据时用户手工选择）
// d.idx                数据在当前文件中的序号（这个可能在多文件的数据里不太实用）
// d.aboutRefund        是否涉及到退款（本身是退款，或者交易关闭当即退款，或者后期有退款）
// d.valueLost          在退款等情况中损失的金额
// d.keyword            识别分类时采用的关键字
// 次要字段：
// d.timePurchased      付款时间（支付宝有些是空的，所以改用上面的`d.time`）
// 仅微信数据带的字段：
// d.dealMethod         付款方式（为了方便，给支付宝数据也加上了空的这个字段）
// 仅支付宝数据带的字段：
// d.serviceFee         服务费
// d.valueRefund        退款金额
// d.stateCapital       资金状态？？？
// d.timeCreated        交易创建时间/发生时间
// d.timeModified       最近修改时间
// d.tradeSource        交易平台/来源地（指天猫、淘宝之类）

// ============================================================================= //

function praseData(datatext, user, platform, charset){
    let notdatas = platform=="alipay" ? datatext.split("\r\n").slice(5, -8) : datatext.split("\r\n").slice(17);
    let tablehead_alipay = "tradeID,orderID,timeCreated,timePurchased,timeModified,tradeSource,tradeType,trader,goodName,value,dealType,stateTrade,serviceFee,valueRefund,note,stateCapital";
    let tablehead_wechat = "timePurchased,tradeType,trader,goodName,dealType,value,dealMethod,stateTrade,tradeID,orderID,note";
    let tablehead = platform=="alipay" ? tablehead_alipay : tablehead_wechat ;
    notdatas.unshift(tablehead);
    let rawdata = notdatas.join("\r\n");
    let predata = d3.csvParse(rawdata);

    // 预处理————;

    let ks = Object.keys(predata[0]);
    // 删掉首尾空格，增加必要的用户、数据来源、序号等字段
    predata.forEach((d,i)=>{
        for( let k in ks ){
            if (typeof(d[ks[k]])=='string') {d[ks[k]]=d[ks[k]].trim();};
        }
        d.user = user;
        d.dataSource = platform;
        d.idx = i;
        d.valueLost = 0;
        d.aboutRefund = false;
        d.keyword = "";
        if (d.dataSource=="alipay") {d.dealMethod="";};//如果是支付宝数据，增加空的“交易方式”字段，来和微信数据对应，免得后期处理时出问题。
    // });

    // 把金额改成数字类型
    // predata.forEach((d,i)=>{
        if (typeof(d.value)=='string'&&d.value.slice(0,1)=="¥") {
            d.value=Number(d.value.slice(1).trim());
        } else if (typeof(d.value)=='string') {d.value=Number(d.value.trim());};
        if (typeof(d.valueRefund)=='string') {d.valueRefund=Number(d.valueRefund.trim());};
        if (typeof(d.serviceFee)=='string') {d.serviceFee=Number(d.serviceFee.trim());};
    // });

    // 把时间改成时间类型
    // predata.forEach((d,i)=>{
        if (d.timeCreated) {d.timeCreated=new Date(d.timeCreated);};
        if (d.timeModified) {d.timeModified=new Date(d.timeModified);};
        if (d.timePurchased || d.timePurchased == "") {
            d.timePurchased=new Date(d.timePurchased);
            // 如果付款时间为空（支付宝数据会出现），那么以发生时间为参考时间，而微信数据只有付款时间，我们只能用付款时间来做时间参照;
            if (d.timePurchased.toString()=="Invalid Date") {d.time=d.timeCreated;} else {d.time=d.timePurchased;}
        };
    });

    let tempIDs=[];
    // 将涉及到退款的订单号都放进一个数组
    predata.forEach((d,i)=>{
        if ((d.goodName.slice(0,2)=="退款")||(d.dataSource=="alipay"&&Number(d.valueRefund)!=0)) {
            d.aboutRefund = true;
            if (d.stateTrade=="交易关闭") {
                // 计算损失金额
                let valueLost = Math.round(100*(d.value-d.valueRefund))/100;
                if (valueLost!=0) {d.valueLost = valueLost;};
            };
            tempIDs.push(d.orderID);
        };
    });

    // 去重
    let tuikuanIDs = [];
    for(let j in tempIDs){
        if(tuikuanIDs.indexOf(tempIDs[j]) == -1)
            tuikuanIDs.push(tempIDs[j]);
    };
    // console.log(tuikuanIDs);

    predata.forEach((d,i)=>{
        let x = tuikuanIDs.indexOf(d.orderID);
        if(x != -1) {
            // console.log(`【${i}】【${x}】【${d.stateTrade}】【${d.orderID}】【${d.goodName}】【${d.value}】【${d.valueRefund}】`);
        };
    });

    return predata;
}



// ============================================================================= //

// 导入支付宝或微信数据

function importData(filepath, user, platform, charset){
    user = arguments[1] ? arguments[1] : "user_defult";
    let filenamestart = filepath.split("/").pop().slice(0,6);
    platform = arguments[2] ? arguments[2] : ( filenamestart=="alipay" ? "alipay" : ( filenamestart=="微信支付账单" ? "wechat" : "unknown" ) );
    if (platform=="unknown") {throw "importData() need 'platform'."};
    charset = arguments[3] ? arguments[3] : ( platform=="alipay" ? "GBK" : "utf-8" );
    let tablehead_alipay = "tradeID,orderID,timeCreated,timePurchased,timeModified,tradeSource,tradeType,trader,goodName,value,dealType,stateTrade,serviceFee,valueRefund,note,stateCapital";
    let tablehead_wechat = "timePurchased,tradeType,trader,goodName,dealType,value,dealMethod,stateTrade,tradeID,orderID,note";
    let tablehead = platform=="alipay" ? tablehead_alipay : tablehead_wechat ;
    return fetch(filepath)
    .then(response => response.arrayBuffer()  )
    .then(buffer => new TextDecoder(charset).decode(buffer)  )
    .then(datatext => praseData(datatext, user, platform, charset)  );
}

// ============================================================================= //

// 导入分类

function importCats(filepath, charset) {
    return fetch(filepath)
    .then(response => response.arrayBuffer())
    .then(buffer => new TextDecoder(charset).decode(buffer))
    .then(t => JSON.parse(t))
}

// 全局变量 cats 用来存放分类

var cats = {"收入": {}, "支出": {}};

// 将分类文件读入 cats 的异步函数

async function readCats(filepath, charset, old){
    charset = arguments[1] ? arguments[1] : "utf-8";
    old = arguments[2] ? arguments[2] : false;
    try {
        const cls = await importCats(filepath, charset);
        cats = old ? cls2cats(cls) : cls;
        onCatsReaded(cats);// 回调函数
    } catch (e) {
        console.log("some error happend in readCats()");
        console.log(e);
        throw e;
    }
}

// 在分类真正读取之后回调的函数。

function onCatsReaded(cats){
    // console.log(cats);
    // 具体应该写重新给数据分类什么的
    updateCategory(cats);
}

// 将老版单层分类json转换成新版双层json的函数

function cls2cats(cls) {
    var c = {"收入": {}, "支出": {}};
    let ks = Object.keys(cls);
    // console.log(ks);
    for (let k in ks) {
        if (ks[k].slice(0,3)=="收入-") {
            c["收入"][ks[k].slice(3)]=cls[ks[k]];
        } else {
            c["支出"][ks[k]]=cls[ks[k]];
        }
    };
    return c;
}

// 给数据分类

function catData(data) {
    let shouruks = Object.keys(cats["收入"]);
    let zhichuks = Object.keys(cats["支出"]);
    data.forEach((d,i)=>{
        if (d.valueLost!=0) {
            d.dealCat = "退货损失";
            d.dealCatSub = "退货损失";
        } else if (d.dealType == "收入" && d.aboutRefund) {
            d.dealCat = "退款收入";
            d.dealCatSub = "退款收入";
        } else if (d.dealType == "收入") {
            let ks = shouruks;
            for (let k in ks) {
                let ink = false;
                let ws = cats["收入"][ks[k]];
                for (let w in ws) {
                    if (d.goodName.search(ws[w]) != -1 || d.trader.search(ws[w]) != -1) {
                        ink = true;
                        d.keyword = ws[w];
                    }
                }
                if (ink) {
                    let hs = ks[k].split("-");
                    if (hs.length >= 2) {
                        d.dealCat = hs[0];
                        d.dealCatSub = hs[1];
                    } else {
                        d.dealCat = hs[0];
                        d.dealCatSub = hs[0];
                    }
                }
            }
            if (!d.dealCat) {
                d.dealCat = "其他收入";
                d.dealCatSub = "其他收入";
                // console.log(`【${d.dealCatSub}】【${d.trader}】【${d.goodName}】「${d.value}」`);
            }
        } else if (d.dealType == "支出") {
            let ks = zhichuks;
            for (let k in ks) {
                let ink = false;
                let ws = cats["支出"][ks[k]];
                for (let w in ws) {
                    if (d.goodName.search(ws[w]) != -1 || d.trader.search(ws[w]) != -1) {
                        ink = true;
                        d.keyword = ws[w];
                    }
                }
                if (ink) {
                    let hs = ks[k].split("-");
                    if (hs.length >= 2) {
                        d.dealCat = hs[0];
                        d.dealCatSub = hs[1];
                    } else {
                        d.dealCat = hs[0];
                        d.dealCatSub = hs[0];
                    }
                }
            }
            if (!d.dealCat) {
                d.dealCat = "其他支出";
                d.dealCatSub = "其他支出";
                // console.log(`【${d.dealCatSub}】【${d.trader}】【${d.goodName}】「${d.value}」`);
            }
        }
    })
    return data;
}

// ============================================================================= //


function onChangeFile() {
    const fileList = document.forms["file-form"]["file-input"].files;
    // console.log(this);
    for (let i=0;i<fileList.length;i++) {
        let file = fileList[i];
        if (file) {
            var f = {};
            f.fileName = file.name;
            let filenamestart = f.fileName.slice(0,6);
            let c = document.forms["file-form"]["file-charset"].value;
            let f_charset = c ? c : ( filenamestart=="alipay" ? "GBK" : "utf-8" );
            if (!document.forms["file-form"]["file-charset"].value || document.forms["file-form"]["file-charset"].value=="utf-8") {document.forms["file-form"]["file-charset"].value=f_charset}
        }
    }
}

function onSubmit() {
    const fileList = document.forms["file-form"]["file-input"].files;
    console.log(fileList);
    for (let i=0;i<fileList.length;i++) {
        let file = fileList[i];
        if (file) {
            var f = {};
            f.fileName = file.name;
            let filenamestart = f.fileName.slice(0,6);
            f.platform = filenamestart=="alipay" ? "alipay" : ( filenamestart=="微信支付账单" ? "wechat" : "unknown" );
            f.user = document.forms["file-form"]["file-user"].value ? document.forms["file-form"]["file-user"].value : "unknown";
            f.charset = document.forms["file-form"]["file-charset"].value ? document.forms["file-form"]["file-charset"].value : ( filenamestart=="alipay" ? "GBK" : "utf-8" );
            f.selected = true;
            filedetials.push(f);

            // https://segmentfault.com/a/1190000006600936
            // https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
            // https://www.cnblogs.com/FHC1994/p/12104170.html

            var reader = new FileReader();
            reader.readAsText(file, f.charset);
            reader.onload = function(evt) {
                console.log("正在读取！");
                // filedetials.push({"filepath":filepath,"user":user,"platform":platform,"charset":charset});
                addUserData(this.result, f.user, f.platform, f.charset)
                console.log("读取完毕！");
            };
        }
    }
}

// ============================================================================= //


// 全局变量 filedatas 用来存放所有的账单数据
var filedatas = [];

// 全局变量 filedetials 用来存放所有的账单文件信息
var filedetials = [];
// f.fileName
// f.user
// f.platform
// f.charset
// f.selected

// 将数据读入 filedatas 的异步函数

async function addData(filepath, user, platform, charset){
    try {
        var f = {};
        f.fileName = filepath.split("/").slice(-1);
        f.user = user;
        f.platform = platform;
        f.charset = charset;
        f.selected = true;
        filedetials.push(f);

        var data = await importData(filepath, user, platform, charset);
        data = catData(data);
        filedatas.push(data);
        onDataAdded();// 回调函数
    } catch (e) {
        console.log("some error happend in addData()");
        console.log(e);
        throw e;
    }
}

function addUserData(datatext, user, platform, charset){
    var data = praseData(datatext, user, platform, charset);
    data = catData(data);
    filedatas.push(data);
    d3.select("#tab-datas > a.nav-link > span.span-nav-desc").text("")
    onDataAdded();// 回调函数
}

function removeData(x){
    // console.log(`删除第 ${x} 行的数据文件`);
    // console.log(d3.selectAll("#files-overview > #files-overview-table > tbody > tr.tr-row"));
    filedatas = filedatas.filter((v, i) => (i != x));
    filedetials = filedetials.filter((v, i) => (i != x));
    d3.select(`#file-tr-${x}`).remove();
    theData();
}

function theData(){
    let the_data = [];
    filedetials.forEach((f,i)=>{
        if(f.selected){
            data_i = filedatas[i];
            data_i.forEach((d,j)=>{
                the_data.push(d);
            })
        }
    })
    printData(the_data);
    return the_data;
}

function printData(data){
    d3.select("#data-overview > #data-overview-table").remove();
    d3.select("#data-overview")
        .append('table').attr("id", "data-overview-table").attr("class", "table table-bordered")
        .append('thead')
        .append('tr').attr("class", "tr-head")
        ;
    var thead_tr = d3.select("#data-overview > #data-overview-table > thead > tr.tr-head");
    thead_tr.append('th').text(`时间`);
    thead_tr.append('th').text(`交易对方`);
    thead_tr.append('th').text(`内容`);
    thead_tr.append('th').text(`收/支`);
    thead_tr.append('th').text(`父类`);
    thead_tr.append('th').text(`子类`);
    thead_tr.append('th').text(`金额`);
    thead_tr.append('th').text(`用户`);
    thead_tr.append('th').text(`是否涉及退款`);
    thead_tr.append('th').text(`退款损失金额`);

    d3.select("#data-overview > #data-overview-table").append("tbody");

    data.forEach((d,i)=>{
        // console.log(f);
        var tr = d3.select("#data-overview > #data-overview-table > tbody").append('tr').attr('class', 'tr-row')
            .attr("id",`data-tr-${i}`)
            ;
        tr.append('td').text(`${d.time}`);
        tr.append('td').text(`${d.trader}`);
        tr.append('td').text(`${d.goodName}`);
        tr.append('td').text(`${d.dealType}`);
        tr.append('td').text(`${d.dealCat}`);
        tr.append('td').text(`${d.dealCatSub}`);
        tr.append('td').text(`${d.value}`);
        tr.append('td').text(`${d.user}`);
        tr.append('td').text(`${d.aboutRefund}`);
        tr.append('td').text(`${d.valueLost}`);
    })
}

// 在数据真正读取之后回调的函数，这玩意儿应该放在 main.js 里。

function onDataAdded(){
    d3.select("#files-overview > #files-overview-table").remove();
    d3.select("#files-overview")
        .append('table').attr("id", "files-overview-table").attr("class", "table table-bordered")
        .append('thead')
        .append('tr').attr("class", "tr-head")
        ;
    var thead_tr = d3.select("#files-overview > #files-overview-table > thead > tr.tr-head");
    thead_tr.append('th').text(`序号`);
    thead_tr.append('th').text(`文件名`);
    thead_tr.append('th').text(`用户`);
    thead_tr.append('th').text(`数据来源`);
    thead_tr.append('th').text(`字符集`);
    thead_tr.append('th').text(`在视图中使用`);
    thead_tr.append('th').text(`删除`);

    d3.select("#files-overview > #files-overview-table").append("tbody");

    filedetials.forEach((f,i)=>{
        // console.log(f);
        var tr = d3.select("#files-overview > #files-overview-table > tbody").append('tr').attr('class', 'tr-row')
            .attr("id",`file-tr-${i}`)
            ;
        tr.append('td').text(`${i}`);
        tr.append('td').text(`${f.fileName}`);
        tr.append('td').text(`${f.user}`);
        tr.append('td').text(`${f.platform}`);
        tr.append('td').text(`${f.charset}`);
        //<input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
        tr.append('td').append('input')
            .attr("type",`checkbox`)
            .attr("id",`file-selected-${i}`)
            .attr("checked",f.selected ? true : null)
            .on("click",()=>{
                this.checked = this.checked ? null : true;
                filedetials[i].selected = filedetials[i].selected ? false : true;
                theData();
                onDataAdded();
            })
            ;
        tr.append('td').text(`-`)
            .on("click",()=>{
                removeData(i);
                onDataAdded();
            })
            ;
    })

    var data = theData();



    d3.selectAll("#partitionSVG *").remove();
    d3.selectAll("#tip-trend *").remove();
    d3.selectAll("#js-heatmap *").remove();
    d3.selectAll("#js-months *").remove();
    d3.selectAll("#js-legend *").remove();
    d3.selectAll("#slider-time *").remove();
    d3.selectAll("#date-selecter *").remove();
    d3.selectAll("#category-selecter *").remove();
    d3.selectAll("#record-list *").remove();
    d3.selectAll("#tooltip *").remove();

    drawCirc(toCircData(data));
    // 具体应该写更新视图之类的东西

    processData(data);
    //updateCirc();
    drawSlider(START_YEAR, END_YEAR);
    drawCategorySelecter();

    //drawCheckBox(CATEGORY);
    drawDateSelecter();
    drawStackChart(ALL_DATA[0].dates.slice(10, 30), [1, 2, 3, 4]);

    //console.log(data.dates);
    createHeatMap(ALL_DATA[CURR_YEAR - START_YEAR], CURR_YEAR, CURR_YEAR + 1);

    selectAllCategory();
    //drawRecordList();
}

// ============================================================================= //

// 读取分类，存入 cats，注意，是异步的，有延迟。

readCats("./python/cls.json", null, true);

// 读取数据，存入 filedatas，注意，是异步的，有延迟。
/*
addData("./data/alipay_record_20191226_1649_1.csv", "mx");
addData("./data/alipay_record_20191225_2224_1.csv", "sch", null, "utf-8");
addData("./data/微信支付账单(20180101-20180401).csv", "sch");
*/
// ============================================================================= //



// ============================================================================= //
