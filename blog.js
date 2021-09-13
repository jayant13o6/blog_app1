const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Users = require('../models/users.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const auth = require('../middleware/auth.js');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet:{
        type: String,
        required:true
    },
    body: {
        type: String,
        required: true
    },
    Username:{
        type: String,
        default: 'aaa'
    },
}, {timestamps: true},);

// blogSchema.Username.push(auth.userCheck.Username)

// const act1 = fillUser();

// // storage 
// var filestorage = multer.diskStorage({
//     destination: (req, flie, cb) =>{
//         cb(null, './uploads')
//     },
//     filename: (req, file, cb)=>{
//         cb(null, Date.now()+ file.originalname)
//     }
// })
// var upload = multer({storage : filestorage})

// // router function to upload file:
// app.post('/{link given in form}', upload.single('filename given in form'), function(req, res, next){
//     var fileInfo = req.file;
//     var title = req.body.title;
//     console.log(title);
//     res.send(title)
// })

// for multiple:
// app.post('/link', upload.array('filename', count), function()=>{})

//models--> mongoose.model('collection name', 'schema name')
const Blog = mongoose.model('Blog',blogSchema);
module.exports = Blog;
// module.exports = fillUser;
