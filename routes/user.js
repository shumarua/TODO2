var express = require("express");
const User = require("../models/user");
const bodyParser = require("body-parser");
var crypto = require("crypto");
//const hbs = require("hbs");
const sgMail = require("@sendgrid/mail");
const { sendgridKey } = require("../config");
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  };

router.get("/", isAuthenticated, function(request, response) {
    User.find({_id:request.user._id}, function(err,result){
        if(err) return console.log(err);
        console.log("USEROOO+",result);
        response.render("user.hbs", {            
            user: request.user.name,
            email: request.user.email,
            userid: request.user._id

        });
    });
    
    
  });

router.get("/pasedit/", isAuthenticated, function(request, response) {
    var pasref = crypto.randomBytes(20).toString('hex');
    User.findOneAndUpdate(
        {_id:request.user._id}, // критерий выборки
        { $set: {pasref:pasref}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            console.log("Useridref",result);
        sgMail.setApiKey(sendgridKey);
        var msg2 = {
        to: request.user.email,
        from: "todo@example.com",
        subject: "Изменение пароля пользователя TODO2",
        text:
          "Чтобы активировать новый пароль перейдите по ссылке http://localhost:3000/user/pasedit/" +
          pasref,
        html:
          "Чтобы активировать новый пароль перейдите по ссылке http://localhost:3000/user/pasedit/" +
          pasref
      };
      sgMail.send(msg2);
      response.send("На почту отправлены инструкции для изменения пароля");          
        });
        
});

router.get("/pasedit/:pasref", isAuthenticated, function(request, response) {
    var pasref = request.params["pasref"];
    response.render("pasedit.hbs", {
        pasref:pasref,
        user:request.user.name,
    });    
});

router.post("/pasedit/:pasref", bodyParser.urlencoded({extended: true}), function(request, response) {
    
    if(!request.body) return response.sendStatus(400);
    //console.warn(request);   
    var pasref = request.params["pasref"];
    //response.render("notegood.hbs");
    User.findOneAndUpdate(
        {pasref: pasref}, // критерий выборки
        { $set: {password: request.body.userpassword}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            console.log(result); 
            response.send("<p>Пароль изменен</p><p><a href='http://localhost:3000/notes/'>Вернуться</a></p>");           
        });
    User.findOne({pasref: pasref}, function(err, result){
        if(err) return console.log(err);
        console.log("User reload==", result); 
                 
    });   
});






  /* router.post("/pasedit/:id", bodyParser.urlencoded({extended: true}), function(request, response) {
    if(!request.body) return response.sendStatus(400);
    var idref = crypto.randomBytes(20).toString('hex');
    var id = request.params["id"];
    User.findOneAndUpdate(
        {_id:id}, // критерий выборки
        { $set: {password: request.body.userpassword, idref:idref}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            console.log("Usernewpas",result);
            
        });
        sgMail.setApiKey(sendgridKey);
        var msg2 = {
        to: request.user.email,
        from: "todo@example.com",
        subject: "Изменение пароля пользователя TODO2",
        text:
          "Чтобы активировать новый пароль перейдите по ссылке http://localhost:3000/user/pasedit/aktivate/" +
          idref,
        html:
          "Чтобы активировать новый пароль перейдите по ссылке http://localhost:3000/user/pasedit/aktivate/" +
          idref
      };
      sgMail.send(msg2);
      response.send("Пароль изменен");
  }); */
  /* router.get("/pasedit/aktivate/:id", function(request, response) {
    response.send("Типа получилось");
   /*  var id = request.params["id"];
    var pas = "";
    User.find({idref:id}, function(err,result){
        if(err) return console.log(err);
        console.log("USER+++",result);
        pas = result.pasref;
    });
    User.findOneAndUpdate(
        {idref:id}, // критерий выборки
        { $set: {password: pas}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            console.log(result);
        response.send("<h1>Пароль изменен</h1>") ;   
    });
   
    
    
  }); */

module.exports = router;