// разбить структуру на роутеры
// template разбить <head> <footer>
// удаление переделать
// проект в git
// автоизация через email (nodemailer smtp, sendgrid )

const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session); // подключаем connect-mongo 
// подключаем парпорт
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
const objectId = require("mongodb").ObjectID;

const cookieParser = require('cookie-parser')
const hbs = require("hbs");
const User = require("./models/user");
const Note = require("./models/notes");
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser());
// правильно ли подлючены?
app.use(cookieParser());
app.use(session({
    secret:'mouse mouse',
    resave: true, 
    saveUninitialized: true
}));
// Как использовать эти ссесии
app.use(passport.initialize());
app.use(passport.session());


// сохраняем и достаем данные из сесии passport
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
   
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

// Верификация passport
//------------------------------------------------------------
passport.use(new LocalStrategy({
    // задаем свои поля к формам
    usernameField: 'username',
    passwordField: 'userpassword'
},
    function(username, password, done) {
        User.findOne({ name: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { 
                console.log('User Not Found with username '+username);
                return done(null, false); 
            }
            if (user){
                
                user.comparePassword(password, function(err, isMatch) {
                    if (err) { return done(err); }
                    if(isMatch){return done(null, user);}
                    else{
                        console.log('password filed');
                        return done(null, false);
                    }
                 });
            }
            //return done(null, false);                                 
      });
    }));
//--------------------------------------------------------

// создаем парсер для данных application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({extended: false});
// устанавливаем путь к каталогу с частичными представлениями
hbs.registerPartials(__dirname + "/views/partials");

app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));

// регистрация пользователя 
app.get("/register",  function (request, response) {

    response.render("register.hbs");

});
// регистрация пользователя POST
app.post("/register", bodyParser.urlencoded({extended: true}), function (request, response) {
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



// аутентификация пользователя POST
app.post('/login', 
    passport.authenticate('local', { 
      failureRedirect: '/notlogin', 
      //failureFlash: 'Invalid username or password.', 
      //successFlash: 'Welcome!' 
    }),
  function(req, res) {
    res.render('logingood.hbs');
  });

app.get("/notlogin", function(request, response){
    response.render("nogood.hbs");
});

/*app.post("/login", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    // express-validator подключить вместо того что вверху

    User.findOne({name: request.body.username}, function(err, result){
        if (err) throw err;
        if(result){
            result.comparePassword(request.body.userpassword, function(err, isMatch) {
                if (err) throw err;
                if(isMatch){
                    request.                   
                    response.render("logingood.hbs");
                    
                    
                }else{               
                    response.render("nogood.hbs");
                }
                
            });
        }else{
            response.render("nogood.hbs");
        }
        
        
                               
    })
    

});*/

// аудентификация пользователя
app.get("/login",  function (request, response) {

    response.render("login.hbs");

});

app.get("/out",  function (request, response) {
    request.logout();
    response.redirect('/');

});

// Главная страница (что тут должно быть?)
// как сделать переадресацию с / на index?
app.get("/", function(request, response){
    response.render("index.hbs");
    //response.render("index.hbs", {user:request.user});
});

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/');
  }

// Страница с заметками
app.get("/notes", isAuthenticated, function(request, response){
    //console.log('Автор', request.user.name);
    //response.render("notes.hbs", { user: request.user });
    
    
    // ищем заметки пользователя и выводим 
    Note.find({author:request.user._id}, function(err, result){
       
         
        if(err) return console.log(err);
        response.render("allnotes.hbs", { 
            result,
            user: request.user.name
        });
    
   
        
       // console.log('notes '+request.user.name,result);
    });
    //response.send("allnotes.hbs");
    
});
app.get("/notes/:id", isAuthenticated, function(req, res){
       
    var id = new objectId(req.params.id);
    Note.findOne({_id: id}, function(err, result){
              
            if(err) return res.status(400).send();
              
            res.send(result);
            response.render("allnotes.hbs");
        });
            
});
app.delete("/notes/:id", function(req, res){       
    var id = new objectId(req.params.id);
    Note.findOneAndDelete({_id: id}, function(err, result){              
            if(err) return res.status(400).send();
            if(result == null){
                console.log("заметка уже удалена");
            }
                 
        });
     //res.redirect("/notes"); 
         
});
//--------------- Изменение заметки  --------------//
app.get("/editnotes/:id", isAuthenticated, function(req, res){
    var id = req.params["id"];
    Note.findOne({_id: id}, function(err, doc){
        //console.log(doc);
        //console.log(doc.text);
        res.render("editnotes.hbs",
        {            
            usernotes:doc.text,
            noteid:doc._id
        }
    );
    });
    
});

app.post("/editnotes/:id", bodyParser.urlencoded({extended: true}), function (request, response) {
    if(!request.body) return response.sendStatus(400);
    //console.warn(request);   
    var id = request.params["id"];
    //response.render("notegood.hbs");
    Note.findOneAndUpdate(
        {_id: id}, // критерий выборки
        { $set: {text: request.body.usernotes}}, // параметр обновления
        function(err, result){
            if(err) return console.log(err);
            //console.log(result);
            
        });
    response.redirect("/notes");
});
//---------------------  удаление заметки ---------------------------// 
app.get("/deletenotes/:id", isAuthenticated, function(req, res){
    var id = req.params["id"];
    Note.findOne({_id: id}, function(err, doc){
        //console.log(doc);
        //console.log(doc.text);
        res.render("deletenotes.hbs",
        {            
            usernotes:doc.text,
            noteid:doc._id
        }
    );
    });
    
});

app.post("/deletenotes/:id", bodyParser.urlencoded({extended: true}), function (request, response) {
    if(!request.body) return response.sendStatus(400);   
    var id = request.params["id"];  
    Note.findOneAndDelete({_id: id}, function(err, result){
            if(err) return console.log(err);
            //console.log(result);           
        });
    response.redirect("/notes");
});
       

//------------------------- проба разработки своего велика
app.get("/addnotes", isAuthenticated, function(request, response){
    //console.log('Автор', request.user.name);
    response.render("addnotes.hbs", { user: request.user }); 

});
app.post("/addnotes", bodyParser.urlencoded({extended: true}), function (request, response) {
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


    

/* app.post("/register", jsonParser, function (req, res) {
      
    if(!req.body) return res.sendStatus(400);
      
    var userName = req.body.username;
    var userPassword = req.body.userpassword;
    var user = {name: userName, password: userPassword};
      
    mongoClient.connect(url, function(err, client){
        client.db("usersdb").collection("userstodo").insertOne(user, function(err, result){
              
            if(err) return res.status(400).send();
              
            res.send(user);
            client.close();
        });
        client.db("usersdb").collection("userstodo").find().toArray(user, function(err, result){
              
            if(err) return res.status(400).send();
              
            console.log(result);
            client.close();
        });
        
    });
});
 */
 // поиск пользователей в базе

/*User.find({}, function(err, docs){
    //mongoose.disconnect();
     
    if(err) return console.log(err);
     
    console.log(docs);
});*/
// поиск заметок в базе

/*Note.find({}, function(err, docs){
    //mongoose.disconnect();
     
    if(err) return console.log(err);
     
    console.log(docs);
});*/




// запускаем сервер
app.listen(3000);