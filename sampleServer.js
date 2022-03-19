//studentserver.js pg.170

const express = require('express');
const app = express();
const fs = require('fs');   // used to manage files on the local computer
const glob = require('glob');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));


app.listen(5678);
console.log('Server is running...');

/**
 * Sample JSON:
 *  '{ "first_name": "Arya", "last_name": "Clark", "gpa": 4.0, "enrolled": true }'
 */

//definition of POST
app.post('/students', function(req, res) {
    var record_id = new Date().getTime();

    var obj = {};
    obj.record_id = record_id;
    obj.first_name = req.body.first_name;
    obj.last_name = req.body.last_name;
    obj.gpa = req.body.gpa;
    obj.enrolled = req.body.enrolled;

    var str = JSON.stringify(obj, null, 2);

    fs.writeFile("students/" + record_id + ".json", str, function(err) {
        var rsp_obj = {}
        if (err) {
            rsp_obj.record_id = -1;
            rsp_obj.message = 'error = unable to create resource';
            return res.status(200).send(rsp_obj);      //200 = OK
        } else {
            rsp_obj.record_id = record_id;
            rsp_obj.message = 'successfully created';
            return res.status(201).send(rsp_obj);   //201 = CREATED
        }
    }); // end of writeFile method
}); //end of post method

app.get('/students/:record_id', function(req, res) {    //:record_id specifies route must include a record id
    var record_id = req.params.record_id;

    fs.readFile("students/" + record_id + ".json", "utf8", function(err, data) {
        if (err) {
            var rsp_obj = {};
            rsp_obj.record_id = record_id;
            rsp_obj.message = 'error - resource not found';
            return res.status(404).send(rsp_obj); // 404 = NOT FOUND
        } else {
            return res.status(200).send(data);  //200 = OK
        }
    });
});

function readFiles(files, arr, res) { // array of paths to files, array of JSON objects, HTTP response object
    fname = files.pop();
    if (!fname) 
        return;
    fs.readFile(fname, "utf8", function(err, data) {
        if (err) {
            return res.status(500).send({"message":"error - internal server error"});
        } else {
            arr.push(JSON.parse(data));
            if (files.length == 0) {
                var obj = {};
                obj.students = arr;
                return res.status(200).send(obj);
            } else {
                readFiles(files, arr, res);
            }
        }
    });
}

app.get('/students', function(req, res) {   // returns all student records
    var obj = {};
    var arr = [];
    filesread = 0;

    glob("students/*.json", null, function(err, files) {    // accepts students/*.json, matches all files in directory with .json
        if (err) {
            return res.status(500).send({"message": "error - internal server error"});
        }
        readFiles(files, [], res);
    });
});

app.put('/students/:record_id', function(req, res) {
    var record_id = req.params.record_id;
    var fname = "students/" + record_id + ".json";
    var rsp_obj = {};
    var obj = {};

    obj.record_id = record_id;
    obj.first_name = req.body.first_name;
    obj.last_name = req.body.last_name;
    obj.gpa = req.body.gpa;
    obj.enrolled = req.body.enrolled;

    var str = JSON.stringify(obj, null, 2);

    //check if file exists
    fs.stat(fname, function(err) {
        if (err == null) {

            //file exists
            fs.writeFile("students/" + record_id + ".json", str, function(err) {
                var rsp_obj = {};
                if (err) {
                    rsp_obj.record_id = record_id;
                    rsp_obj.message = 'error - unable to update resource';
                    return res.status(200).send(rsp_obj);   //200 = OK
                } else {
                    rsp_obj.record_id = record_id;
                    rsp_obj.message = 'successfully updated';
                    return res.status(201).send(rsp_obj);   //202 = CREATED
                }
            });
        } else {
            rsp_obj.record_id = record_id;
            rsp_obj.message = 'error - resource not found';
            return res.status(404).send(rsp_obj);           // 404 = NOT FOUND
        }
    });
});

app.delete('/students/:record_id', function(req, res) {
    var record_id = req.params.record_id;
    var fname = "students/" + record_id + ".json";

    fs.unlink(fname, function(err) {
        var rsp_obj = {};
        if (err) {
            rsp_obj.record_id = record_id;
            rsp_obj.message = 'error - resource not found';
            return res.status(404).send(rsp_obj);
        } else {
            rsp_obj.record_id = record_id;
            rsp_obj.message = 'record deleted';
            return res.status(200).send(rsp_obj);
        }
    });
}); // end delete method