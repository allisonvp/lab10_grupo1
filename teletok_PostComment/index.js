const mysql = require("mysql2");
const querystr = require('querystring');

exports.handler = (event, context, callback) => {

    if (event.body !== null && event.body !== undefined) {
        //context.callbackWaitsForEmptyEventeLoop = false;

        var bodyBase64 = Buffer.from(event.body, 'base64').toString();
        var body = querystr.parse(bodyBase64);

        var token = body.token;
        var postid = body.postId;
        var message = body.message;

        var conn = mysql.createConnection({
            host: "database-prueba.ceirp8ifrhcv.us-east-1.rds.amazonaws.com",
            user: "admin",
            password: "9JsxoEBby4y1xhUkeMlq",
            port: 3306,
            database: "teletok_lambda"
        })
        conn.connect(function(error) {
            if (error) {
                conn.end(function() {
                    callback(error, {
                        statusCode: 400,
                        body: JSON.stringify({
                            "estado": "error",
                            "msg": error
                        })
                    });
                });
            }
            else {

                var response = {
                    headers: {
                        "Content-Type": "application/json"
                    },
                };



                var sql1 = "SELECT * FROM token WHERE code=?";


                var params = [token];
                
                conn.query(sql1, params, function(error, result) {
                    if (error) {
                        conn.end(function() {
                            response.statusCode = 400;
                            response.body = JSON.stringify({
                                "estado": "BD",
                                "msg": "error de base de datos"
                            });
                            callback(error, response);
                        });
                    }
                    else {
                        console.log(result);
                        if (result[0]==null) {
                            conn.end(function() {
                                response.statusCode = 400;
                                response.body = JSON.stringify({
                                    "error": "TOKEN_INVALID",
                                });
                                callback(null, response);
                            });
                        }
                        else {

                            var sql2 = "insert into post_comment(message, user_id, post_id) values (?,(SELECT user_id FROM token where code=?),?)";

                            var params2 = [message,token, postid];
                            
                            conn.query(sql2, params2, function(err2, result2) {
                                if (err2) {
                                    
                                    conn.end(function() {
                                        response.statusCode = 400;
                                        response.body = JSON.stringify({
                                            "error": "POST_NOT_FOUND",
                                        });
                                        callback(err2, response);
                                    });
                                    
                                }
                                else {
                                    var idnew =result2.insertId;
                                   

                                    conn.end(function() {
                                        response.statusCode = 200;
                                        response.body = JSON.stringify({
                                            "commentId": idnew,
                                            "status": "COMMENT_CREATED"
                                        });
                                        callback(null, response);
                                    });
                                }
                            });


                        }





                    }
                });

                
            }
        });
    }

};
