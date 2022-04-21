const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fs = require("fs");

const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const Animal = require("./models/animal");
const auth = require("./auth.js");
var router = express.Router();
const log = require("./logstash.js");

mongoose.set("useFindAndModify", false);

const Logger = function (req, res, next) {
  log("info", "request-incoming", {
    path: req.url,
    method: req.method,
    ip: req.ip,
    ua: req.headers["user-agent"] || null,
  });
  next();
};

app.use(Logger);

app.use(express.json());
app.use(morgan("dev"));

router.get("/animals", async (req, res) => {
  animals = await Animal.find({}, "name");
  console.log(animals);
  res.json(animals);
});

router.post("/animals", auth, async (req, res) => {
  animal_name = req.body.name;
  console.log(animal_name);
  const animal = new Animal({
    name: animal_name,
  });
  animal
    .save()
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((err) => console.log(err));
});

router.put("/animals", auth, async (req, res) => {
  prev_name = req.body.prev_name;
  new_name = req.body.new_name;

  const query = { name: prev_name };

  r = await Animal.findOneAndUpdate(
    query,
    { name: new_name },
    {
      new: true,
    }
  );
  res.json(r);
});

router.delete("/animals", auth, async (req, res) => {
  delete_name = req.body.name;

  //r = await Animal.deleteOne({ name: delete_name});

  r = await Animal.findOneAndDelete({ name: delete_name });
  res.json({ deleted: r });
});

app.use("/api", router);

const PORT = process.env.PORT || 4003;
const HOST = process.env.HOST || "127.0.0.1";

const dbURI = process.env.MONGO_URI;

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to db");
    console.log("running on port: " + PORT);
    app.listen(PORT, () => {
      log("verbose", "listen", { host: HOST, port: PORT });
    });
  })
  .catch((err) => console.log(err));
