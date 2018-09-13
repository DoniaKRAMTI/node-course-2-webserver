var env = process.env.NODE_ENV || 'development';
console.log( 'env *****',env);
if(env === 'development') {
process.env.PORT =3000;
process.env.MONGODB_URI ='mongodb://localhost:27017/TodoApp';
}else if (env ==='test') {
process.env.PORT =3000;
process.env.MONGODB_URI ='mongodb://localhost:27017/TodoApp';
}
//require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require ('body-parser');
const {ObjectID} = require ('mongodb');

var {mongoose} =require ('./db/mongoose');
var {Todo}= require('./db/models/todo');
var {User} = require('./db/models/user');

var app = express();
var port = process.env.PORT || 3000;


app.use(bodyParser.json());

app.post('/todos', (req, res) => {

var todo = new Todo ({
    text:req.body.text
});
todo.save().then((doc) => {
    res.send(doc);
}, (e) => {
   res.status(400).send(e); 

});
});
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    })
});

// GET /Todos/1234324
app.get('/todos/:id' ,(req,res) => {
    var id = req.params.id;
    //valid id using isValid
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findById(id).then((todo) =>{
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();;

    })

   
});

app.delete('/todos/:id',(req,res) =>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
Todo.findByIdAndRemove(id).then((todo) =>{
    if(!todo) {
        return res.status(404).send();
    }
    res.send({todo});
}).catch((e) => {
    res.status(400).send();
});
});
app.patch('/todos/:id' ,(req,res) =>{
    var id =req.params.id;
    var body  = _.pick(req.body, ['text' , 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed) &&body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) =>{
   if (!todo) {
       return res.status(404).send();
   }
    }).catch((e) => {
        res.status(400).send();
    })
});
//POST /users
app.post('/users', (req,res) =>{
var body = _.pick(req.body, ['email','password']);
var user = new User(body);
//User.findByToken
//user.generateA
 user.save().then((user) =>{
     return user.generateAuthToken();
 }).then((token) =>{
 res.header('x-auth',token).send(user);
    // res.send(user);
 }).catch((e) =>{
     res.status(400).send(e);
 })

});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
 });
 
module.exports ={app};