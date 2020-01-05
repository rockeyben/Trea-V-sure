
// ============================================================================= //

// 导入支付宝或微信数据
// 数据结构说明：
// 主要字段（也就是可视化里面可能要用到的字段）：
// d.time               参考时间，用来在时间轴上定位，大部分是支付时间，少数是订单发生时间
// d.tradeType          交易类型
// d.trader             交易对方
// d.goodName           商品名称
// d.dealType           是收入还是支出
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

function importData(filepath, user, platform, charset){
    user = arguments[1] ? arguments[1] : "user_defult";
    let filenamestart = filepath.split("/").pop().slice(0,6);
    platform = arguments[2] ? arguments[2] : ( filenamestart=="alipay" ? "alipay" : ( filenamestart=="微信支付账单" ? "wechat" : "unknown" ) );
    if (platform=="unknown") {throw "importData() need 'platform'."};
    charset = arguments[3] ? arguments[3] : ( platform=="alipay" ? "GBK" : "utf-8" );
    let tablehead_alipay = "tradeID,orderID,timeCreated,timePurchased,timeModified,tradeSource,tradeType,trader,goodName,value,dealType,stateTrade,serviceFee,valueRefund,note,stateCapital";
    let tablehead_wechat = "timePurchased,tradeType,trader,goodName,dealType,value,dealMethod,stateTrade,tradeID,orderID,note";
    let tablehead = platform=="alipay" ? tablehead_alipay : tablehead_wechat ;
    let slice_start = platform=="alipay" ? 5 : 17 ;
    let slice_end = platform=="alipay" ? -8 : -1 ;
    return fetch(filepath)
    .then(response => response.arrayBuffer())
    .then(buffer => new TextDecoder(charset).decode(buffer))
    .then(notdata => notdata.split("\r\n").slice(slice_start, slice_end))
    .then(notdata => {notdata.unshift(tablehead); return notdata})
    .then(notdatas => notdatas.join("\r\n"))
    .then(rawdata => d3.csvParse(rawdata))
    .then(predata => {

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
            if (d.dataSource=="alipay") {d.dealMethod="";};//如果是支付宝数据，增加空的“交易方式”字段，来和微信数据对应，免得后期处理时出问题。
        // });

        // 把金额改成数字类型
        // predata.forEach((d,i)=>{
            if (typeof(d.value)=='string'&&d.value.slice(0,1)=="¥") {
                d.value=Number(d.value.slice(1,-1).trim());
            } else if (typeof(d.value)=='string') {d.value=Number(d.value.trim());};
            if (typeof(d.valueRefund)=='string') {d.valueRefund=Number(d.valueRefund.trim());};
            if (typeof(d.serviceFee)=='string') {d.serviceFee=Number(d.serviceFee.trim());};
        // });

        // 把时间改成时间类型
        // predata.forEach((d,i)=>{
            if (d.timeCreated) {d.timeCreated=new Date(d.timeCreated);};
            if (d.timeModified) {d.timeModified=new Date(d.timeModified);};
            if (d.timePurchased) {
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
        console.log(tuikuanIDs);

        predata.forEach((d,i)=>{
            let x = tuikuanIDs.indexOf(d.orderID);
            if(x != -1) {
                console.log(`【${i}】【${x}】【${d.stateTrade}】【${d.orderID}】【${d.goodName}】【${d.value}】【${d.valueRefund}】`);
            };
        });

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
        onDataAdded(data);// 回调函数
    } catch (e) {
        console.log("some error happend in importData()");
        console.log(e);
        throw e;
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





































