var express = require('express');
//const hbs = require("hbs");

const Note = require("../models/notes");
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  };

//------------------------- проба разработки своего велика
router.get("/", isAuthenticated, function(request, response){
    //console.log('Автор', request.user.name);
    response.render("addnotes.hbs", { user: request.user }); 

});
router.post("/", function (request, response) {
    if(!request.body) return response.sendStatus(400);
    //console.warn(request);
    var note = new Note({       
        text: request.body.usernotes,
        author:request.user._id,
    });
    
    note.save(function(err){
        //mongoose.disconnect();         
        if(err) return console.log(err);
        //console.log("Сохранен объект", note);        
    });
    //response.render("notegood.hbs");
    response.redirect("/notes");
}); 


    

module.exports = router;