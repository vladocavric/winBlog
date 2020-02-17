const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    rp = require('request-promise'),
    mongoose = require('mongoose'),
    moment = require('moment');

mongoose.connect('mongodb://localhost:27017/winBlog', {useNewUrlParser: true, useUnifiedTopology: true});

const blog = mongoose.model('blog', {
    title: {type: String, default: 'blog title'},
    picture: {type: String, default: '/dummy.jpg'},
    body: String,
    date: {type: Date, default: Date.now}
});

app.use(express.static('themes'));
app.use(bodyParser.urlencoded({extend: true}));
app.set('view engine', 'ejs');

//restful routes
app.get('/', function (req, res) {
    res.redirect('/blogs');
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
    // let title = req.body.title;
    // let picture = req.body.pictureURL;
    // let body = req.body.body;
    // let date = new Date();
    // let dataForDB = {
    //     title: title,
    //     picture: picture,
    //     body: body,
    //     date: date
    // };

    blog.create(req.body.blog, function (err, blogs) {
        if (err) {
            console.log(err);
        } else {
            // console.log(blog);
            // console.log(dataForDB)
        }
    });
    res.redirect('/blogs')
});

app.get('/blogs/:id', function (req, res) {
    let id = req.params.id;
    blog.findById(id, function (err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render('blogs/show', {blog: foundBlog})
        }
    });
});

// app.get('/blogs/:id/edit', function (req, res) {
//     let id = req.params.id;
//     let title = req.body.title;
//     let picture = req.body.pictureURL;
//     let body = req.body.body;
//     // let date = new Date();
//     let dataForDB = {
//         title: title,
//         picture: picture,
//         body: body,
//         date: date
//     };
//     blog.findById(id, function (err, foundBlog) {
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('blogs/edit', {blog: foundBlog})
//         }
//     });
//     blog.updateOne({id: id}, dataForDB, function (err, blog) {
//         if (err) {
//             console.log(err);
//         } else {
//             // console.log(blog);
//             res.redirect('blogs/show')
//         }
//     });
//
// });

// app.delete('/blogs/:id', function (req, res) {
//     let id = req.params.id;
//     blog.deleteOne({ id: id }, function (err, foundBlog) {
//         if(err) {
//             console.log('this is en error')
//             console.log(err);
//         } else {
//             console.log(blog.id)
//             res.render('blogs/index', {blog: foundBlog})
//         }
//     });
// });

app.get('*', function (req, res) {
    res.send('404')
});

app.listen(3092);