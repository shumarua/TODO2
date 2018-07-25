var express = require('express');
//const User = require("./models/user");
const bodyParser = require("body-parser");
//const hbs = require("hbs");

var router = express.Router();

// Страница с заметками
router.get("/notes", isAuthenticated, function(request, response){
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

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  } ;
router.get("/notes/:id", isAuthenticated, function(req, res){
       
    var id = new objectId(req.params.id);
    Note.findOne({_id: id}, function(err, result){
              
            if(err) return res.status(400).send();
              
            res.send(result);
            response.render("allnotes.hbs");
        });
            
});
router.delete("/notes/:id", function(req, res){       
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