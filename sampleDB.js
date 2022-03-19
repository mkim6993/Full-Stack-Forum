// insertsteps.js problem 6.16

const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://127.0.0.1:27017";

MongoClient.connect(uri, {useUnifiedTopology: true}, function(err, client) {
    if (err) throw err;

    var dbo = client.db("fitness");

    dbo.createCollection("steps", function(err, res) {
        if (err) throw err;
    });

    var clientSteps = [
        {
            "date": "05/01/2022",
            "steps": 5200
        },
        {
            "date": "05/02/2022",
            "steps": 12200
        },
        {
            "date": "05/03/2022",
            "steps": 3769
        },
        {
            "date": "05/04/2022",
            "steps": 2342
        },
        {
            "date": "05/05/2022",
            "steps": 1
        },
        {
            "date": "05/06/2022",
            "steps": 9999
        },
        {
            "date": "05/07/2022",
            "steps": 3321
        },
        {
            "date": "05/08/2022",
            "steps": 2222
        },
        {
            "date": "05/09/2022",
            "steps": 2
        },
        {
            "date": "05/10/2022",
            "steps": 19999
        }
    ];

    dbo.collection("steps").insertMany(clientSteps, function(err, res) {
        if (err) throw err;
        console.log("steps inserted");
        client.close();
    });
})










// findsome.js pg.202
const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://127.0.0.1:27017/";

MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, client) {
    if (err) throw err;

    var dbo = client.db("music");

    dbo.collection("songs").find(
        {},                                    // empty query parameter {}
        { projection: { _id: 0, title: 1 } } // projection operator specifies which fields to include: 0 = exclude, 1 = include
        ).toArray(function(err, res) {
            if (err) throw err;

            console.log( JSON.stringify(res, null, 4));
            client.close();
        });
});

// findsort.js pg.207
//queryand.js
const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://127.0.0.1:27017/";

MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, client) {
    if (err) throw err;

    var dbo = client.db("music");

    //define a sort criteria
    var mysort = { "title": 1 }; // 1 = ascending, -1 = descending

    dbo.collection("songs").find().sort(mysort).toArray(function(err, res) {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            console.log( res[i].duration + ' , ' + res[i].title);
        }
        client.close();
    });
});