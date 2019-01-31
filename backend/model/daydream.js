const mongoose = require('mongoose');

let dayDreamSchema = new mongoose.Schema({
    circleID: {type: String},
    destinatin: {type: String},
    description: {type: String},
    /* information for travel widget */
    travelInformation: [{
        mode: String,   /* vehicle, plane, bus, etc */
        cost: Number,
        user: String,
    }],
    /* information for lodging widget */
    lodgingInformation: [{
        address: String,
        cost: Number,
        user: String,
    }],
    /* excursion information */
    excursions: [{
        user: String,
        cost: Number,
        information: String,
        category: String
    }],
    totalCost: {type: Number, default: 0},
    individualContribution: [{
        user: String,
        money: Number
    }]
})

/* Creating the user model from the schema and giving it to Mongoose */
let DayDream = mongoose.model('DayDream', dayDreamSchema);

module.exports = DayDream;
