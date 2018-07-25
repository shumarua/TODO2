var express = require('express');
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
var router = express.Router();

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

router.get("/out",  function (request, response) {
    request.logout();
    response.redirect('/');

});

module.exports = router;