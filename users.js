const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Username :{
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true 
    },
    Confirm_password: {
        type: String,
        required: true
    }
},{timestamps:true});

//models--> mongoose.model('collection name', 'schema name')
const Users = mongoose.model('Users',userSchema);
module.exports = Users;
