const mysql = require('mysql');
const querystring = require('querystring');

exports.handler = function(event, context, callback) {

    if (event.body !== null && event.body !== undefined) {

        var bodyBase64 = Buffer.from(event.body, 'base64').toString();
        var body = querystring.parse(bodyBase64);

        var token = body.code;
        var description = body.description;

        var conn = mysql.createConnection({
            host: "database-prueba.clhnarfk7uyo.us-east-1.rds.amazonaws.com",
            user: "admin",
            password: "pC6V9152HODJJW8VdSds",
            port: 3306,
            database: "teletok_lambda"
        });

        conn.connect(function(error) {
            if (error) {
                conn.end(function() {
                    callback(error, {
                        statusCode: 400,
                        body: JSON.stringify({
                            "estado": "error",
                            "msg": "error en la conexión a base de datos"
                        })
                    });
                });
            }
            else {

                var query = "SELECT t.* FROM token t WHERE t.code=?";

                conn.query(query, [token], function(err1, resultado1) {

                    if (err1) {
                        conn.end(function() {
                            callback(error, {
                                statusCode: 400,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                                body: JSON.stringify({
                                    "estado": "error",
                                    "msg": "TOKEN_INVALID",
                                    "err": err1
                                })
                            });
                        });

                    }
                    else {

                        var query2 = "insert into post (description, creation_date,user_id ) values (?,?,?)";
                        var currentTime = new Date();
                        var parametros2 = [description, currentTime, resultado1.user_id];
                        conn.query(query2, parametros2, function(err2, resultado2) {
                            if (err2) {
                                conn.end(function() {
                                    callback(error, {
                                        statusCode: 400,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                        body: JSON.stringify({
                                            "estado": "error",
                                            "msg": "SAVE_ERROR",
                                            "err": err2
                                        })
                                    });
                                });
                            }
                            else {

                                conn.end(function() {
                                    callback(null, {
                                        statusCode: 200,
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                        body: JSON.stringify({
                                            postId: resultado2.insertId,
                                            status: "POST_CREATED"
                                        })
                                    });
                                });

                            }
                        });
                    }
                });
            }
        });
    });
