
// ============================================================================= //

// 导入支付宝或微信数据

function importData(filepath, user, platform, charset){
    var user = arguments[1] ? arguments[1] : "user_defult";
    var filenamestart = filepath.split("/").pop().slice(0,6);
    var platform = arguments[2] ? arguments[2] : ( filenamestart=="alipay" ? "alipay" : ( filenamestart=="微信支付账单" ? "wechat" : "unknown" ) );
    if (platform=="unknown") {throw "importData() need 'platform'."};
    var charset = arguments[3] ? arguments[3] : ( platform=="alipay" ? "GBK" : "utf-8" );
    var tablehead_alipay = "tradeID,orderID,timeCreated,timePurchased,timeModified,tradeSource,tradeType,trader,goodName,value,dealType,stateTrade,serviceFee,valueRefund,note,stateCapital";
    var tablehead_wechat = "timePurchased,tradeType,trader,goodName,dealType,value,dealMethod,stateTrade,tradeID,orderID,note";
    var tablehead = platform=="alipay" ? tablehead_alipay : tablehead_wechat ;
    var slice_start = platform=="alipay" ? 5 : 17 ;
    var slice_end = platform=="alipay" ? -8 : -1 ;
    return fetch(filepath)
    .then(response => response.arrayBuffer())
    .then(buffer => new TextDecoder(charset).decode(buffer))
    .then(notdata => notdata.split("\r\n").slice(slice_start, slice_end))
    .then(notdata => {notdata.unshift(tablehead); return notdata})
    .then(notdatas => notdatas.join("\r\n"))
    .then(rawdata => d3.csvParse(rawdata))
    .then(predata => {
        ks = Object.keys(predata[0]);
        for( var k in ks ){
            predata.forEach((d,i)=>{
                d[ks[k]]=d[ks[k]].trim();
                d.user = user;
                d.dataSource = platform;
                if (d.value.slice(0,1)=="¥") {d.value=d.value.slice(1,-1)};
            })
        }
        return predata;
    })
}

// ============================================================================= //


// 全局变量 filedatas 用来存放所有的账单数据

var filedatas = [];

// 将数据读入 filedatas 的异步函数

async function addData(filepath, user, platform, charset){
    try {
        const data = await importData(filepath, user, platform, charset);
        filedatas.push(data);
        onDataAdded(data);
    } catch (e) {
        console.log("some error happend in importData()");
        console.log(e);
    }
}

// ============================================================================= //

// 读取数据，存入 filedatas，注意，是异步的，有延迟。这玩意儿应该放在 main.js 里。

addData("./data/alipay_record_20191226_1649_1.csv", "mx");
addData("./data/alipay_record_20191225_2224_1.csv", "sch", null, "utf-8");
addData("./data/微信支付账单(20180101-20180401).csv", "sch");

// ============================================================================= //

// 在数据真正读取之后回调的函数，这玩意儿应该放在 main.js 里。

function onDataAdded(data){
    console.log(data);
    // 具体应该写更新视图之类的东西
}

// ============================================================================= //





































