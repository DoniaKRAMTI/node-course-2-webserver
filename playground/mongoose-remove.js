const {ObjectID} = require ('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/db/models/todo');
const {User} = require ('./../server/db/models/user');


 Todo.remove({}).then((result) => {
     console.log(result);
 });

 //Todo.findOneAndRemove
 //Todo.findByIdAndRemove

 Todo.findByIdAndRemove('5b9910fbe531724e28c9d0cf').then((todo) => {
console.log(todo);
 })
