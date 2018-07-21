const async = require("async");
const db = require("../config").db;
const debug = require("debug")("getOJ:updata:saveOJ");

/**
 * 
 * @param {String} oj_list
 * @param {Function} callback
 */

exports.saveJudgeList = function(oj_list,callback){
    // debug("保存列表％d％s",oj_list.ID,oj_list.title);

    console.log(new Date().toUTCString()+" "+"开始储存LIST数据");
    async.eachSeries(oj_list,function(list,next){
        db.query("SELECT * FROM `oj_list` WHERE `ID`=? LIMIT 1",[1],function(err,data){
            if(err) console.log(err);
            if(Array.isArray(data) && data.length>0){
                db.query("UPDATE `oj_list` SET `passRate`=? WHERE `ID`=? ",[list.passRate,1],next);
            }else{
                db.query("INSERT INTO `oj_list` (`title`,`author`,`passRate`) VALUES (?,?,?)",[list.title,list.author,list.passRate],next);
            }
        });
    },callback);
}

/**
 * 
 * @param {String} oj_content 
 * @param {Function} callback 
 */
exports.saveJudgeContent = function(oj_content,callback){
    // debug("保存列表题目％d％s",1,"sdadsa");
    console.log(new Date().toUTCString() + " " + "开始储存CONTENT数据");
    async.eachSeries(oj_content,function(list,next){
        db.query("SELECT * FROM `oj_content` WHERE `title`=? LIMIT 1",[list.title],function(err,data){
            if(err) console.log(err);
            if(Array.isArray(data) && data.length>0){
                db.query("UPDATE `oj_content` SET `description`=? , `inputFormat`=? ,`outputFormat`=?,`sampleInput`=?,`sampleOutput`=? WHERE `title`=?",[list.description,list.inputFormat,list.outputFormat,list.sampleInput,list.sampleOutput,list.title],next);
            }else{
                db.query("INSERT INTO `oj_content` (`title`,`description`,`inputFormat`,`outputFormat`,`sampleInput`,`sampleOutput`) VALUES (?,?,?,?,?,?)",[list.title,list.description,list.inputFormat,list.outputFormat,list.sampleInput,list.sampleOutput],next);
            }
        });

    },callback)
}








