require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json()); // Can now send JSON to app

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos)  => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET /todos/1234s
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    // Valid id using isValiud
    if(!ObjectID.isValid(id)){
        // 404 - send back empty object
        return res.status(404).send();
    }
    
    Todo.findById(id).then((todo) => {
        if (!todo){
            // if no todo - send back 404 with empty body
            return res.status(404).send();
        }

        // if todo - send it back
        res.send({todo});
    }).catch((e) => {
        // error
        // 400 - send back empty body
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id;
    
    // validate the id ->not valid? return 404
    if(!ObjectID.isValid(id)){
        // 404 - send back empty object
        return res.status(404).send();
    }

    // remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo){
            // if no todo - send back 404 with empty body
            return res.status(404).send();
        }

        // if todo - send it back
        res.send({todo});
    }).catch((e) => {
        // error
            // 400 with empty body
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    // validate the id ->not valid? return 404
    if(!ObjectID.isValid(id)){
        // 404 - send back empty object
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo){
            return res.status(404).send();
        }
        
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started up on port ${port}`);
});

module.exports = {app};