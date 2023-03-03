const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newTask = new Schema({
    description:{
        type:String,
        required : true
    },
    completed:{
        type : Boolean,
        required : true,
        default : false
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,

    }
    
})
const Task = mongoose.model('task', newTask);
module.exports = Task;