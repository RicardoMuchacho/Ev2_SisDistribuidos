const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const animalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});


const Animal = mongoose.model('Animal', animalSchema);
module.exports = Animal;