const mysql = require("mysql");

exports.db = mysql.createConnection({
    user : "root",
    url : "localhost",
    password : "outlook9423",
    database : "worms"
})

exports.getOJURI = {
    url : "https://acm.sjtu.edu.cn/OnlineJudge/problems"
}