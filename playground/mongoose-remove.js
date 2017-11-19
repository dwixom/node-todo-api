const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove()

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '5a11fb23584750aceb9584b7'}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('5a11fb23584750aceb9584b7').then((todo) => {
    console.log(todo);
});