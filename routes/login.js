const express = require('express');
const passport = require('passport');
const User = require("../models/user");
const LocalStrategy  = require('passport-local').Strategy;
const router = express.Router();

router.post('/', 
    passport.authenticate('local', { 
      failureRedirect: '/login/not', 
      //failureFlash: 'Invalid username or password.', 
      //successFlash: 'Welcome!' 
    }),
  function(req, res) {
    res.render('logingood.hbs');
  });

router.get("/not", function(request, response){
    response.render("nogood.hbs");
});

// аудентификация пользователя
router.get("/",  function (request, response) {

    response.render("login.hbs");

});

router.get("/aktivate/:ref",  function (request, response) {
    var ref = request.params["ref"];
    User.findOneAndUpdate(
        {idref: ref}, // критерий выборки
        { $set: {isVerified: true}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            //console.log(result);
            
        });


    response.render("emailref.hbs");

});

router.get("/out",  function (request, response) {
    request.logout();
    response.redirect('/');

});

module.exports = router;