<<<<<<< HEAD
const mysql = require('mysql2');

exports.handler = (event, context, callback) => {

    var conn = mysql.createConnection({
        host: "database-pruebas.cvdiq9drvcm2.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "bvdm9iSLzQWT2YutZmw5",
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
                        "msg": error
                    }),
                });
            });
        }
        else {
            conn.query("SELECT p.id, p.description, p.creation_date, u.username, count(c.post_id) as 'commentCount' FROM teletok_lambda.post p INNER JOIN post_comment c ON (c.post_id = p.id) INNER JOIN user u ON (u.id = p.id) GROUP BY p.id", 
            function(err, result) {
                if (err) {
                    conn.end(function(){;
                    callback(err, {
                        statusCode: 400,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            "estado": "error",
                            "msg": err
                        })
                    });
                    });
                }
                else {
                    conn.end(function() {
                        callback(null,  {
                            statusCode: 200,
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                "estado": "ok",
                                "msg": result
                            })
                        });

                    });
                }
            });
        }
    });
=======
exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
>>>>>>> b821191fb025a44dcd9435f45d67c40ba66dba87
};
