var express = require("express");
var crypto = require("crypto");
const User = require("../models/user");
const bodyParser = require("body-parser");
//const hbs = require("hbs");
const sgMail = require("@sendgrid/mail");

const { sendgridKey } = require("../config");
var router = express.Router();

// регистрация пользователя
router.get("/", function(request, response) {
  response.render("register.hbs");
});

// регистрация пользователя POST
router.post("/", bodyParser.urlencoded({ extended: true }), function(
  request,
  response
) {
  if (!request.body) return response.sendStatus(400);
  //console.warn(request);
  var idref = crypto.randomBytes(20).toString('hex');
  var user = new User({
    name: request.body.username,
    password: request.body.userpassword,
    email: request.body.useremail,
    idref: idref
  });

  user.save(function(err, user, result) {
    //mongoose.disconnect();

    if (err) return console.log(err);
    console.log(result);
  });

  sgMail.setApiKey(sendgridKey);
  const msg = {
    to: request.body.useremail,
    from: "todo@example.com",
    subject: "Регистрация в заметках TODO2",
    text:
      "Чтобы активировать запись перейдите по ссылке http://localhost:3000/login/aktivate/" +
      idref,
    html:
      "Чтобы активировать запись перейдите по ссылке http://localhost:3000/login/aktivate/" +
      idref
  };
  sgMail.send(msg);

  //console.log("request.body=", msg);

  response.render("good.hbs");
});

module.exports = router;
