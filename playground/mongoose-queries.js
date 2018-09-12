const {ObjectID} = require ('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/db/models/todo');
const {User} = require ('./../server/db/models/user');

// var id ='5b97eb2a35abdba24d735710';

// if(!ObjectID.isValid(id)) {
//     console.log('Is not valid');
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos',todos);
// });
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo',todo);
// });
// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id',todo);
// }).catch((e) => console.log(e));
User.findById('5b97903356700197280bcca8').then((user) =>{
  if(!user) {
      return console.log('Unable to find user');
  } 
   console.log(JSON.stringify(user, undefined, 2));
}, (e) => {
    console.log(e);
});