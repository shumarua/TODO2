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

//---------------------  удаление заметки ---------------------------// 
router.get("/:id", isAuthenticated, function(req, res){
    var id = req.params["id"];
    Note.findOne({_id: id}, function(err, doc){
        //console.log(doc);
        //console.log(doc.text);
        res.render("deletenotes.hbs",
        {            
            usernotes:doc.text,
            noteid:doc._id
        }
    );
    });
    
});


router.post("/:id", bodyParser.urlencoded({extended: true}), function (request, response) {
    if(!request.body) return response.sendStatus(400);   
    var id = request.params["id"];  
    Note.findOneAndDelete({_id: id}, function(err, result){
            if(err) return console.log(err);
            //console.log(result);           
        });
    response.redirect("/notes");
});
       
module.exports = router;