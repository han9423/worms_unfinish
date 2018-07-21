const async = require("async");
const getOJ = require("./getOJ");
const saveOJ = require("./saveOJ");
const config = require("../config");
const debug = require("debug")("getOJ:updata:main");
var getOJList;
var getOJContent = [];
async.series([
    function (callback){
        console.time("1");
        getOJ.readJudgeList(config.getOJURI.url,function(err,Ojdata){
            getOJList=Ojdata;
            callback(err);
        })
        console.timeEnd("1");
    },
    // 读取每个url的页面内容
    function(callback){
        console.time("2")
        async.eachSeries(getOJList,function(list,next){
            getOJ.readJudgeContent(list.url,function(err,content){
                if(err) console.log(err);
                getOJContent.push(content[0]);
                next();
            })
        },callback);
        console.timeEnd("2");
    },
    //保存List到数据库
    function(callback){
        console.time("3")
        saveOJ.saveJudgeList(getOJList,function(err){if(err){console.log(err)}else{console.log(new Date().toUTCString()+"结束写入LIST")}});
        callback();
        console.timeEnd("3");
    },
    // 保存content到数据库
    function(callback){
        saveOJ.saveJudgeContent(getOJContent,function(err){if(err)console.log(err);});
        callback();
    }

],function(err,result){
    if(err) console.log(err);   
})





