var express = require('express');
//const User = require("../models/user");
const bodyParser = require("body-parser");
//const hbs = require("hbs");

const app = express();

const Note = require("../models/notes");
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  };

//--------------- Изменение заметки  --------------//
router.get("/:id", isAuthenticated, function(req, res){
    var id = req.params["id"];
    Note.findOne({_id: id}, function(err, doc){
        //console.log(doc);
        //console.log(doc.text);
        res.render("editnotes.hbs",
        {            
            usernotes:doc.text,
            noteid:doc._id
        }
    );
    });
    
});

router.post("/:id", bodyParser.urlencoded({extended: true}), function (request, response) {
    if(!request.body) return response.sendStatus(400);
    //console.warn(request);   
    var id = request.params["id"];
    //response.render("notegood.hbs");
    Note.findOneAndUpdate(
        {_id: id}, // критерий выборки
        { $set: {text: request.body.usernotes}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            //console.log(result);
            
        });
    response.redirect("/notes");
});

module.exports = router;