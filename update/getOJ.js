const cheerio = require("cheerio");
const request = require("request");
const debug = require("debug")("blog:update:getOJ");


/**
 * 
 * @param {String} url
 * @param {Function} callback
 * 
 */

exports.readJudgeList = function (url, callback) {
    debug("读取题目列表:%s",url);
    request(url, function (err, res) {
        if (err) return callback(err);
        var $ = cheerio.load(res.body.toString());
        var Ojdata = [];
        $("tbody tr").each(function () {
            var tempUrl = $(this).find("td a").attr("href");
            var eachPromble = {
                ID: $(this).find("td").first().text().replace(/\n/g, "").replace(/\s/g, ""),
                title: $(this).find("td a").text(),
                author: $(this).find("td").eq(2).text(),
                passRate: $(this).find("td").eq(3).text(),
            }
            eachPromble.url = "https://acm.sjtu.edu.cn" + tempUrl;
            Ojdata.push(eachPromble);
        })

        var nextPage = "https://acm.sjtu.edu.cn" + $(".pagination ul li").last().find("li a").attr("href");
        var judugeLast = nextPage.match(/.$/g)
        if (judugeLast == "#") nextPage=false;
        if (nextPage) {
            exports.readJudgeList(nextPage, function (err, Ojdata2) {
                callback(null, [...Ojdata, ...Ojdata2]);
            })
        } else {
            callback(null, Ojdata);
        }
    })
}

/**
 * @param {String} url
 * @param {Function} callback
 */

exports.readJudgeContent = function (url, callback) {
    debug("读取页面内容:%s",url)
    request(url, function (err, res) {
        if (err) console.log(err);
        var content = [];
        var $ = cheerio.load(res.body.toString());
        function setModule(i) {
            var tempStr = "";
            $(".span9 h2").eq(i).nextAll().each(function (index, val) {
                if (val.innerText == $(".span9 h2").eq(i + 1).text()) {
                    return false;
                } else {
                    tempStr += $(this).text().replace(/\n|\t|'/g,"");
                }
            })
            return tempStr;
        }
        var JudgeContent = {
            title: $(".page-header h1").text(),
            description: setModule(0),
            inputFormat: setModule(1),
            outputFormat: setModule(2),
            sampleInput: $("pre code").eq(0).text().replace(/\n/g,""),
            sampleOutput: $("pre code").eq(1).text().replace(/\n/g,""),
        }
        content.push(JudgeContent);
        callback(null, content);
    })
}

// /**
//  * 
//  * @param {String} mainUrl
//  */

// readJudgeList(mainUrl, function (err, Ojdata) {
//     if (err) console.log(err);
//     async.eachSeries(Ojdata, function (value, callback) {
//         readJudgeContent(value.url, function (err, content) {
//             if (err) console.log(err);
//             console.log(content);
//             callback();
//         })
//     }, function (err) {
//         if (err) console.log(err);
//     })
// })
