
//Express
const express = require('express');
const app = express();
//const glob = require('glob');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

app.listen(5678);
console.log('Forum server is running');

//DB
const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://127.0.0.1:27017";

/*
 *  Definition of POST
*/
app.post('/newPost', function(req, res) {
    var d = new Date;

    var obj = {};
    obj.date = (d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear();
    obj.first_name = "Hector";
    obj.last_name = "Bellerine";
    obj.title = req.body.title;
    obj.text = req.body.text;

    MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, client) {
        if (err) {
            client.close();
            return res.status(200).send({ "message": "error - internal server error" });
        }

        var dbo = client.db("forum");
        dbo.collection("posts").insertOne(obj, function(err, resobj) {
            if (err) {
                client.close();
                return res.status(200).send({ "message": "error in insertOne()"});
            } else {
                client.close();
                return res.status(201).send({ "message": "Successful!"});
            }
        });
    });
});

app.get('/home', function(req, res) {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, client) {
        if (err) {
            client.close();
            return res.status(200).send({ "message": "error - database connection error"});
        }

        var dbo = client.db("forum");
        var mysort = {"_id": -1};
        dbo.collection("posts").find().sort(mysort).toArray(function(err, resobj) {
            if (err) {
                client.close();
                return res.status(200).send({ "message": "error - find error" });
            } else {
                res.status(201).send({ "message": "Success!", "posts": resobj});
                client.close();
                return;
            }
        });
    });
});

app.put('')