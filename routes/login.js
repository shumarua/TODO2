const express = require('express');
const passport = require('passport');
const User = require("../models/user");
const LocalStrategy  = require('passport-local').Strategy;
const router = express.Router();

router.post('/', 
    passport.authenticate('local'),
  function(req, res) {
      console.log(req)
    res.render('logingood.hbs');
  });

router.get("/not", function(request, response){
    response.render("nogood.hbs");
});

// аудентификация пользователя
router.get("/",  function (request, response) {
   
    response.render("login.hbs");

});

router.get("/123",  function(request, response) {

    User.findOne({name:"sasha3"}, function(err, doc){
        //console.log(doc);
        //console.log(doc.text);
        if(err) return console.log(err);
        console.log("USERQQQ=", doc);
    });
    response.send("<h2>Привет</h2>");
});

router.get("/aktivate/:ref",  function (request, response) {
    var ref = request.params["ref"];
    User.findOneAndUpdate(
        {idref: ref}, // критерий выборки
        { $set: {isVerified: true}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            return response.render("emailref.hbs");
            //console.log(result);
            
        });


    

});

router.get("/out",  function (request, response) {
    request.logout();
    response.redirect('/');

});

module.exports = router;