const express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      request    = require('request'),
      rp         = require('request-promise'),
      mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017/winBlog', {useNewUrlParser: true, useUnifiedTopology: true});

const blog = mongoose.model('blog', {
    title: String,
    picture: String,
    body: String,
    date: Date
});

app.use(express.static('themes'));
app.use(bodyParser.urlencoded({extend: true}));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('home')
});

app.get('/blog', function (req, res) {
    blog.find({}, function (err, blog) {
        if(err){
            console.log(err);
        } else {
            res.render('blog/index', {blog: blog})
        }
    })
});

app.post('/blog', function (req, res) {
    let title = req.body.title;
    let picture = req.body.pictureURL;
    let body = req.body.body;
    let date = new Date();
    let dataForDB = {
        title: title,
        picture: picture,
        body: body,
        date: date
    };

    blog.create(dataForDB, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            // console.log(blog);
        }
    });
    res.redirect('blog')
});

app.get('/blog/new', function (req, res) {
    res.render('blog/addblog')
});

app.get('/blog/:id', function (req, res) {
    let id = req.params.id;
    blog.findById(id, function (err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render('blog/show', {blog: foundBlog})
        }
    });
});

app.delete('/blog/:id', function (req, res) {
    let id = req.params.id;
    blog.deleteOne({ id: id }, function (err, foundBlog) {
        if(err) {
            console.log(err);
        } else {
            res.render('blog/index', {blog: foundBlog})
        }
    });
});

app.get('*', function (req, res) {
    res.send('404')
});

app.listen(3092);