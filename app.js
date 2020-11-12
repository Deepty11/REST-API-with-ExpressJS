const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.set("view-engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });
console.log("wikiDB created");
const articleSchema = {
    title: String,
    content: String
}

const articleModel = mongoose.model("articles", articleSchema);

app.route("/articles")
    .get(function(req, res) {
        articleModel.find({}, function(err, resultFound) {
            if (!err) {
                res.send(resultFound);
            } else {
                res.send(err);
            }
        });
    })
    .post(function(req, res) {
        console.log(req.body.title);
        console.log(req.body.content);
        const article = new articleModel({
            title: req.body.title,
            content: req.body.content
        });
        article.save(function(err) {
            if (!err) {
                res.send("svaed");
            } else {
                res.send("not saved");
            }
        });


    })
    .delete(function(req, res) {
        articleModel.deleteMany({}, function(err) {
            if (!err) {
                res.send("deleted");
            }

        });
    });
app.route("/articles/:articleTitle")
    .get(function(req, res) {
        const param = req.params.articleTitle;
        articleModel.findOne({ title: param }, function(err, resultFoud) {
            if (!err) {
                res.send(resultFoud);
            } else {
                res.send(err);
            }
        })


    })
    .put(function(req, res) {
        articleModel.update({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true }, function(err) {
            if (!err) {
                res.send("Updated");
            } else {
                res.send(err);
            }
        })
    })
    .patch(function(req, res) {
        // req.body={

        //     content:req.body.content
        // }
        articleModel.update({ title: req.params.articleTitle }, { $set: req.body }, function(err) {
            if (!err) {
                res.send("Updated");
            } else {
                res.send(err);
            }
        })
    })
    .delete(function(req, res) {
        articleModel.deleteOne({ title: req.params.articleTitle }, function(err) {
            if (!err) {
                res.send("deleted");
            } else {
                res.send(err);
            }

        });
    });
// app.get("/", function(req, res) {
//     res.send("Hello world");
// });
// app.get("/articles", function(req, res) {
//     articleModel.find({}, function(err, resultFound) {
//         if (!err) {
//             res.send(resultFound);
//         } else {
//             res.send(err);
//         }
//     });
// });
// app.post("/articles", function(req, res) {
//     console.log(req.body.title);
//     console.log(req.body.content);
//     const article = new articleModel({
//         title: req.body.title,
//         content: req.body.content
//     });
//     article.save(function(err) {
//         if (!err) {
//             res.send("svaed");
//         } else {
//             res.send("not saved");
//         }
//     });


// });
// app.delete("/articles", function(req, res) {
//     articleModel.deleteMany({}, function(err) {
//         if (!err) {
//             res.send("deleted");
//         }

//     });
// });
app.listen(3000, function() {
    console.log("started listening to port 3000");
});