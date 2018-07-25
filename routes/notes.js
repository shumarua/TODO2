var express = require('express');
//const User = require("../models/user");
//const bodyParser = require("body-parser");
//const hbs = require("hbs");

const app = express();

const Note = require("../models/notes");
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  };

// Страница с заметками
router.get("/", function(request, response){
    //console.log('Автор', request.user.name);
    //response.render("notes.hbs", { user: request.user });
    
    
    // ищем заметки пользователя и выводим 
    Note.find({author:request.user._id}, function(err, result){
       
         
        if(err) return console.log(err);
        response.render("allnotes.hbs", { 
            result,
            user: request.user.name
        });
        //console.log('notes ', result);
   
        
       // console.log('notes '+request.user.name,result);
    });
    //response.send("allnotes.hbs");
    
});



router.get("/:id", isAuthenticated, function(req, res){
       
    var id = new objectId(req.params.id);
    Note.findOne({_id: id}, function(err, result){
              
            if(err) return res.status(400).send();
              
            res.send(result);
            response.render("allnotes.hbs");
        });
            
});
router.delete("/:id", function(req, res){       
    var id = new objectId(req.params.id);
    Note.findOneAndDelete({_id: id}, function(err, result){              
            if(err) return res.status(400).send();
            if(result == null){
                console.log("заметка уже удалена");
            }
                 
        });
     //res.redirect("/notes"); 
         
});


module.exports = router;