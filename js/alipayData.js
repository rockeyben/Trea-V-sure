
// 可以导入支付宝数据

function alipayData(filepath, user, charset){
    var user = arguments[1] ? arguments[1] : "user_defult";
    var charset = arguments[2] ? arguments[2] : "GBK";
    var tablehead = "tradeID,orderID,timeCreated,timePurchased,timeModified,tradeSource,tradeType,trader,goodName,value,dealType,stateTrade,serviceFee,valueRefund,note,stateCapital";
    return fetch(filepath)
    .then(response => response.arrayBuffer())
    .then(buffer => new TextDecoder(charset).decode(buffer))
    .then(notdata => notdata.split("\r\n").slice(5,-8))
    .then(notdata => {notdata.unshift(tablehead); return notdata})
    .then(notdatas => notdatas.join("\r\n"))
    .then(rawdata => d3.csvParse(rawdata))
    .then(predata => {
        ks = Object.keys(predata[0]);
        for( var k in ks ){
            predata.forEach((d,i)=>{
                d[ks[k]]=d[ks[k]].trim();
                d.user = user;
            })
        }
        return predata;
    })
}

var adata;

alipayData("./data/alipay_record_20191226_1649_1.csv", "mx").then(data => {
    adata = data;
    // console.log(adata);

    alipayData("./data/alipay_record_20191225_2224_1.csv", "sch", "utf-8").then(data => {
        for( var i in data ){
            adata.push(data[i]);
        }
        // adata = adata.concat(data);
        console.log(adata);
    })

})
