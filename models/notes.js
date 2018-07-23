const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/usersdbho");
var Schema = mongoose.Schema;
var noteSchema = new Schema({
  
    text:{
      type:String,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  
  }, {timestamps: true});


  var Note = mongoose.model("Note", noteSchema);
  module.exports = Note;  