const Router = require('express').Router

const notes = require("./notes");
const register = require("./register");
const editnotes = require("./editnotes");
const deletenotes = require("./deletenotes");
const addnotes = require("./addnotes");
const login = require("./login");
const user = require("./user");

const routes = new Router()

routes.use('/register',  register);
routes.use('/notes',  notes);
routes.use('/editnotes',  editnotes);
routes.use('/deletenotes',  deletenotes);
routes.use('/addnotes',  addnotes);
routes.use('/login',  login);
routes.use('/user', user);

module.exports = routes