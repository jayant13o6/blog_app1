const { render } = require('ejs');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const Users = require('./models/users.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth.js');
const multer = require('multer');
const { db } = require('./models/users.js');
var mongo = require('mongodb');
const comments = require('./models/comment.js');

// setup express app

const app = express();
app.use(express.urlencoded({extended:true})); //middleware
app.use(cookieParser());
// app.use(uploading())

// connect to mongodb 
const dbURI = 'mongodb+srv://12361224:12361224@mark1cluster.tivul.mongodb.net/blog_db?retryWrites=true&w=majority';
mongoose.connect(dbURI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    .then(() => app.listen(3000, ()=>{console.log('we start express and Mongodb connected')}))  //listen for request
    .catch(err => console.log(err));
// var new_db = "mongodb://localhost:27017/blog_db"

// public file:
app.use(express.static('./uploads'));

// register view engine
app.set('view engine', 'ejs');




// app.get('path',function (req,res) {
//     res.write();
//     res.send();    // donot need to to set header type
//     res.end();
// })
 
//method to add blog by brute force (not currently in used)

app.get('/add-blog',(req,res)=>{
    const blog =  new Blog({
        title: 'new blog3',
        snippet: 'about new blog2',
        body: ' very extra details'
    });

    blog.save()
        .then((result) =>{
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.get('/add-user',(req,res)=>{
    const user =  new Users({
        username: 'captain13',
        password: '8888',
        confirm_password: '8888'
    });

    user.save()
        .then((result) =>{
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
        });
});

 
// upload image

// storage 
var storage = multer.diskStorage({
    destination: function(req, flie, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now()+ file.originalname)
    }
});

const upload = multer({storage : storage});

// method: get; details of all the blogs
app.get('/all-blogs', (req,res) =>{
    Blog.find()
        .then((result) => {res.send(result);})
        .catch((err) => {console.log(err);
            });

});
// app.get('/', (req, res) =>{ 

//     // res.send('Homepage');
//     res.render('index', { title:'homepage' });
//     console.log(__dirname);
// });



//blog routes

app.get('/', (req,res) =>{ 
    // this leads to homepage which is for signup
    res.render('signup',);
    // Users.find()
});


app.get('/blogs',auth, (req,res) =>{    // auth given to make it hidden
    // displays all the blogs
    Blog.find().sort({createdAt:-1})
        .then((result)=> {
            res.render('index', {title: 'All Blogs', blogs: result})
        })
        .catch((err) =>{ console.log(err); })
});



app.get('/blogs/create', (req, res) =>{
    res.render('create_blog');
})

app.get('/signin',(req,res) =>{
    res.render('signin')
    // console.log(req);
    
})  


// sends the data to database 
app.post('/blogs', auth, upload.single('images'), async (req,res)=>{        // auth is middleware to for using userCheck
    
    console.log('***',req.file);
    var blog = new Blog({
        title: req.body.title,
        snippet: req.body.snippet,
        body: req.body.body,
        image: req.file.filename,
    })
    
    console.log('-->',req.body);
    // const blog = new Blog(req.body);
    const token = req.userCheck.Username;
    console.log('token/user name:',token)
    // blog.image = req.file;
    console.log(req.file)
    
    blog.save()

        .then((result) =>{
            // get rerquest from cookies: req.cookies.cookie_name
            // console.log(`this one cookie ${req.cookies.cookie1}`);
            
        const id = result.id
        console.log(id)
        Blog.findByIdAndUpdate(id, {Username : token.toString()}, (err,docs)=>{
            if(err) throw err;
            console.log("Record updated click click");
            console.log(docs);
        })
    
            res.redirect('/blogs');
        })
        .catch((err) => {  console.log(err)
        })
})

//sends data to db of user 
app.post('/users/signup', async (req,res)=>{
    name1=req.body.Username
    console.log(req.body);
    console.log("data recived");
    const users = new Users(req.body);

    // token generted
    const token = await users.createToken();
    console.log('token is :' + token)
    
    // cookies: res.cookie('name', value, [options])
    res.cookie('cookie1' , token, {
        expires: new Date(Date.now() + 1000*60*60*24),     //expiry for a day
        httpOnly: true
    })
    

    // save the data in db
    users.save()
    .then((result) =>{
        // res.redirect('/blogs');  index:0
        console.log(name1,result.Username,'<-----')
        link1 = '/blogs/user/' + result.Username
        console.log(link1,typeof(link1))
        // res.render('personal_blog',{users: result, title: 'Personal Blog!!'});
        res.render('personal_blog',{blogs: result, title: 'Personal Blog!!'});
        // res.redirect('./blogs/user/<%= result.Username %>')    //index:1
        // res.redirect(link1)
        
        
    })
    .catch((err) => {console.log(err);})
        
})


// routes to personal blog  (not working)
app.get('/blogs/personal', async (req,res) => {

    const token = req.cookies.cookie1;
    const verifyUser = jwt.verify(token,'verystrongsecrettokeep');
    // console.log('info1:',verifyUser);        
    const userCheck = await Users.findOne({_id:verifyUser._id})
    
    name1=Blog.Username
    name2=userCheck.Username    
    console.log("---",name1,name2)
    Blog.find({Username:name2})
        .then(result=> {
            console.log(result);
            res.render('personal_blog',{blogs: result , title: 'Personal Blog!!'});
            // res.render('personal_blog',{users: result, title: 'Personal Blog!!'});        
        })
        
    .catch((err) => {
        console.log(err)
    })
        
})// route ended


app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
        .then(result =>{
            res.render('details', {blog: result, title: 'Blog details'})
            // <!--{blog: result, variable: 'value'}-->
            // res.render('view_file string format': object, {})
        })
    .catch((err) => {
        console.log(err)
    })
})  




// function for sign_in to check if id exsits or not  
app.post('/users',async (req,res) => {
    var user_name = req.body.Username;
    console.log(req.body.Username);
    const result= await Users.findOne({Username:user_name})
       
        if (result){ //res.redirect('/blogs')
            
            // createToken();  // token called

        const token = await result.createToken();
        console.log('token is :' + token)

        // cookies: res.cookie('name', value, [options])
        res.cookie('cookie1' , token, {
        expires: new Date(Date.now() + 1000*60*60*24),
        httpOnly: true
        });

            
            res.render('personal_blog',{blogs: result, title: 'Personal Blog!!'});                
    }
        else{  res.render(('not found')) } 
})


// Logout feature:
app.get('/logout', auth, async(req,res) => {
    try {
        // // logout from single user
        // console.log(req.userCheck);
        // req.userCheck.tokens = req.userCheck.tokens.filter((currEle) =>{
        //     return currEle.token !== req.token
        // })


        // logout from all :
        req.userCheck.tokens=[];

        res.clearCookie('cookie1') // clears the cookie
        console.log('logout successfully');

        await req.userCheck.save()
        res.redirect('/');

    } catch (error) {
        // res.render(500).send(error)
        console.log(error);
    }

})

// delete blog
app.delete('/blogs/:id', (req,res) => {
    const id = req.params.id;
    console.log(id,"to delete");
    Blog.findByIdAndDelete(id)
        .then(result =>{
            res.json({redirect: '/blogs'})
        })
        .catch(err => console.log(err))
    }
)


// router function to upload file:
// app.post('/upload', upload.array('images',5), function(req, res, next){
//     var fileInfo = req.file;
//     var title = req.body.title;
//     console.log(title);
//     res.send(fileInfo);
//     res.render('uploaded');
//     next();
// })


app.use((req,res) => {
    // res.status(404).sendFile('404.html', {root: __dirname});
    res.render('404');
})