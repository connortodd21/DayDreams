const mongoose = require('mongoose');

let circleSchema = new mongoose.Schema({
    founder: {type: String},
    members: {type: [String]},
    circleName: {type: String, required: true, unique: true},
    dateCreated: {type: Date, default: Date.now},
    numberOfPeople: {type: Number, default: 1},
    dayDreams: {type: [String]},
})


/* Creating the user model from the schema and giving it to Mongoose */
let Circle = mongoose.model('Circles', circleSchema);

module.exports = Circle