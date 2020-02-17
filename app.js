const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    rp = require('request-promise'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    moment = require('moment');

mongoose.connect('mongodb://localhost:27017/winBlog', {useNewUrlParser: true, useUnifiedTopology: true});

const blog = mongoose.model('blog', {
    title: String,
    picture: {type: String, default: '/dummy.jpg'},
    body: String,
    date: {type: Date, default: Date.now}
});

app.use(express.static('themes'));
app.use(bodyParser.urlencoded({extend: true}));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

//restful routes
app.get('/', function (req, res) {
    res.redirect('/blogs');
    // res.render('home', {moment, moment});
});

app.get('/blogs', function (req, res) {
    blog.find({}, function (err, blog) {
        if (err) {
            console.log(err);
        } else {

            res.render('blogs/index', {blog: blog, moment: moment})
        }
    })
});

app.get('/blogs/new', function (req, res) {
    res.render('blogs/addblog', {moment: moment})
});

app.post('/blogs', function (req, res) {
    blog.create(req.body.blog, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs')
        }
    });
});

app.get('/blogs/:id', function (req, res) {
    blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect('/blogs')
        } else {

            res.render('blogs/show', {blog: foundBlog, moment: moment})
        }
    });
});

app.get('/blogs/:id/edit', function (req, res) {
    console.log(req.body.blog);
    blog.findById(req.params.id, function (err, foundBlog) {

        if (err) {
            console.log(err);
        } else {
            res.render('blogs/edit', {blog: foundBlog, moment: moment})
        }
    });
});

app.put('/blogs/:id', function (req, res) {
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, blog) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
});

app.delete('/blogs/:id', function (req, res) {
    blog.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/blogs');
        }
    })
    // let id = req.params.id;
    // blog.deleteOne({id: id}, function (err, foundBlog) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         // res.render('blogs/index', {blog: foundBlog})
    //     }
    // });
});

app.get('*', function (req, res) {
    res.send('404')
});

app.listen(3092);