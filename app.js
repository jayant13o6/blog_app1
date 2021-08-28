const { render } = require('ejs');
const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog.js');
const Users = require('./models/users.js');

// setup express app

const app = express();
app.use(express.urlencoded({extended:true})); //middleware


// connect to mongodb 
const dbURI = 'mongodb+srv://12361224:12361224@mark1cluster.tivul.mongodb.net/blog_db?retryWrites=true&w=majority';
mongoose.connect(dbURI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
    .then(() => app.listen(3000, ()=>{console.log('we start express and Mongodb connected')}))
    .catch(err => console.log(err));


// register view engine
app.set('view engine', 'ejs');

//listen for request


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
    // res.redirect('blogs');
    res.render('signup');
    Users.find()
});

app.get('/blogs', (req,res) =>{
    Blog.find().sort({createdAt:-1})
        .then((result)=> {
            res.render('index', {title: 'All Blogs', blogs: result})
        })
        .catch((err) =>{ console.log(err); })
})
app.get('/summer',(req,res) =>{
    // res.statusCode=200;
    // res.sendFile('summer.html' ,{root: __dirname});
    res.render('summer');
});


app.get('/blogs/create', (req, res) =>{
    res.render('create_blog');
})

app.get('/signin',(req,res) =>{
    res.render('signin');
})

// sends the data to database 
app.post('/blogs',(req,res)=>{
    console.log(req.body);
    const blog = new Blog(req.body);
    blog.save()
        .then((result) =>{
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err)
        })
})

//sends data to db of user 
app.post('/users',(req,res)=>{
    console.log(req.body);
    console.log("data recived");
    const users = new Users(req.body);
    users.save()
        .then((result) =>{
            res.redirect('/blogs');
        })
        .catch((err) => {
            console.log(err)
        })
})

app.get('/blogs/:id', (req,res) => {
    const id = req.params.id;
    console.log(id);
    Blog.findById(id)
        .then(result =>{
            res.render('details', {blog: result, title: 'Blog details'})
        })
    .catch((err) => {
        console.log(err)
    })
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
app.use((req,res) => {
    // res.status(404).sendFile('404.html', {root: __dirname});
    res.render('404');
});