const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");

function addUser(name, pass) {
  const user = new User({
    name: name,
    password: pass,
  });
  user
    .save()
    .then((result) => {
      console.log(result);
    })
    .catch((err) => console.log(err));
}

//addUser("rickmuch", "r");

function getUser(name, pass) {
  User.findOne({ name: name, password: pass }, function (err, user) {
    if (err) return console.log(err);
    user1 = new User(user);
    logged.name = user.name;
    console.log(user.name, user.email, user.password, user._id);
    return user1;
  });
}

function updateUser(userid, name, email, pass) {
  try {
    update = {
      name: name,
      email: email,
      password: pass,
    };
    User.findOneAndUpdate({ _id: userid }, update, function (err, user) {
      console.log(user.name, user.email, user.password, user._id);
    });
    console.log(update);
  } catch {
    (e) => console.log(e);
  }
}

function deleteUser(userid) {
  User.findOneAndDelete({ _id: userid }, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted User : ", user);
    }
  });
}
