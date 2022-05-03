const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let todoItemSchema = Schema({
    name:{
        type: String,
        required: true,
        maxlength: 40
    },
    priority:{
        type: Number,
        min: [1, "1 is the lowest priority item"],
		max: [5, "5 denotes a the highest-priority item"]
    }
});

let ToDoItems = mongoose.model('ToDo', todoItemSchema);
module.exports = ToDoItems;