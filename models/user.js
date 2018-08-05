const bcrypt = require("bcrypt-nodejs");
//const crypto = require('crypto');
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/usersdbho");
var Schema = mongoose.Schema;
//SALT_WORK_FACTOR = 10;

var userSchema = new Schema(
  {
    //_id: Schema.Types.ObjectId,
    name: {
      type: String,
      require: true,
      unique: true,
      minlength: 3,
      maxlength: 10,
      index: { unique: true }
    },
    password: {
      type: String,
      require: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    email: {
      type: String
      //unique: true
    },
    idref: {
      type: String
    },
    pasref: {
      type: String
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    roles: {
      type: [String],
      enum: ["admin", "user"],
      default: ["user"]
    }, // роль пользователя (роли)
    notes: { type: Schema.Types.ObjectId, ref: "Notes" }
  },
  { timestamps: true }
);

/*UserSchema.pre(save, function(next) {
  const user = this;

// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
  if (err) return next(err);

  // hash the password using our new salt
  bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
  });
});


});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
  });
};*/
/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this;
  //console.log(user);
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/** что за метод? распознавание аватаров?
 * Helper method for getting user's gravatar.
 */
/*userSchema.methods.gravatar = function gravatar(size) {
    if (!size) {
      size = 200;
    }
    if (!this.email) {
      return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
  };
  */
var User = mongoose.model("User", userSchema);

module.exports = User;

//exports.userSchema = mongoose.model("User", userSchema);
