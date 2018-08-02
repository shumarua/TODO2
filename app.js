// страничка юзера, изменение пароля, сброс пароля (отдельное поле)
// аватарка, по умолчанию и возможность изменить (локально) multer

const express = require("express");
const app = express();

const routes = require("./routes");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session); // подключаем connect-mongo
// подключаем парпорт
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const User = require("./models/user");
const Note = require("./models/notes");

app.use(bodyParser.urlencoded({ extended: true }));
//const register = require('./routes/register');

//app.use('/register',  register);
//app.use(bodyParser());
// правильно ли подлючены?
app.use(cookieParser());
app.use(
  session({
    secret: "mouse mouse",
    resave: true,
    saveUninitialized: true
  })
);
// Как использовать эти ссесии
app.use(passport.initialize());
app.use(passport.session());

// подключаем роуты
app.use(routes);
// сохраняем и достаем данные из сесии passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Верификация passport
//------------------------------------------------------------
passport.use(
  new LocalStrategy(
    {
      // задаем свои поля к формам
      usernameField: "username",
      passwordField: "userpassword"
    },
    function(username, password, done) {
      User.findOne({ name: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          console.log("User Not Found with username " + username);
          return done(null, false);
        }
        if (user.isVerified == false) {
          console.log("Учетная запись неактивна");
          return done(null, false);
        }
        if (user) {
          user.comparePassword(password, function(err, isMatch) {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              console.log("password filed");
              return done(null, false);
            }
          });
        }
        //return done(null, false);
      });
    }
  )
);
//--------------------------------------------------------

// создаем парсер для данных application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// устанавливаем путь к каталогу с частичными представлениями
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

// Главная страница (что тут должно быть?)
// как сделать переадресацию с / на index?
app.get("/", function(request, response) {
  response.render("index.hbs");
  //response.render("index.hbs", {user:request.user});
});

// запускаем сервер
app.listen(3000);
