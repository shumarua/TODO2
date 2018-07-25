var express = require('express');
const User = require("../models/user");
const bodyParser = require("body-parser");
//const hbs = require("hbs");

var router = express.Router();

// регистрация пользователя 
router.get("/",  function (request, response) {

    response.render("register.hbs");
    

});

// регистрация пользователя POST
router.post("/", bodyParser.urlencoded({extended: true}), function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.warn(request)
    var user = new User({       
        name: request.body.username,
        password:request.body.userpassword,
    });
    
    user.save(function(err, user, result){
        //mongoose.disconnect(); 
        
        if(err) return console.log(err);
        console.log(arguments);
    });
    
    
    //console.log(request.body);

    response.render("good.hbs");
    


});

module.exports = router;