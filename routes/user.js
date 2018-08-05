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
        //console.log("USEROOO+",result);
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
      response.send("<p>На почту отправлены инструкции для изменения пароля</p><p><a href='http://localhost:3000/user/'>Вернуться</a></p>");          
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
      
    var pasref = request.params["pasref"];   
   User.findOne({pasref: pasref}, function(err, user){      
    if(err) return console.log(err);
    user.password = request.body.userpassword;
    user.save((err) => {
      if (err) { return next(err); }    
      response.send("<p>Ваш пароль изменен, для авторизации перейдите по ссылке</p><p><a href='/login/'>Вернуться</a></p>");
    });
   // console.log("User reload==", user); 
             
    });   
    /* User.findOne({pasref: pasref}, function(err, result){
        if(err) return console.log(err);
        console.log("User reload==", result); 
                 
    });    */
});
router.get("/pasreset", function(request, response) {   
    response.render("pasreset.hbs");    
});

router.post("/pasreset", bodyParser.urlencoded({extended: true}), function(request, response) { 
    if(!request.body) return response.sendStatus(400);     
    var username = request.body.username;
    var pasref = crypto.randomBytes(20).toString('hex');
    User.findOneAndUpdate(
        {name:username}, // критерий выборки
        { $set: {pasref:pasref}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            // как отработать ошибку - нет такого пользователя           
        console.log("UPDATE=",result);         
        });      
   User.findOne({name: username}, function(err, user){      
    if(err) return console.log(err);
    /* if(!user.email){
        response.send("<p>Такого пользователя не существует</p><p><a href='/pasreset'>Вернуться</a></p>");
    } */
    sgMail.setApiKey(sendgridKey);
    var msg3 = {
    to: user.email,
    from: "todo@example.com",
    subject: "Восстановление пароля пользователя TODO2",
    text:
      "Чтобы создать новый пароль перейдите по ссылке http://localhost:3000/user/pasreset/" +
      pasref,
    html:
      "Чтобы создать новый пароль перейдите по ссылке http://localhost:3000/user/pasreset/" +
      pasref
  };
  sgMail.send(msg3);
  response.send("<p>На почту отправлены инструкции для восстановления пароля</p><p><a href='http://localhost:3000/'>на главную</a></p>"); 
    
             
    });   
    User.findOne({pasref: pasref}, function(err, result){
        if(err) return console.log(err);
        console.log("User reload==", result); 
                 
    });   
});
router.get("/pasreset/:pasref", function(request, response) {
    var pasref = request.params["pasref"];
    response.render("pasresetnew.hbs",{
        pasref:pasref,
    });    
});
router.post("/pasreset/:pasref", bodyParser.urlencoded({extended: true}), function(request, response) { 
    var pasref = request.params["pasref"];   
   User.findOne({pasref: pasref}, function(err, user){      
    if(err) return console.log(err);
    user.password = request.body.userpassword;
    user.save((err) => {
      if (err) { return next(err); }    
      response.send("<p>Ваш новый пароль создан, для авторизации перейдите по ссылке</p><p><a href='/login/'>Вернуться</a></p>");
    });
    console.log("User reload==", user); 
             
    });   
});


module.exports = router;