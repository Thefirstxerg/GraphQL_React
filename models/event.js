const mongoose = require('mongoose');

const schema = mongoose.Schema;

const eventSchema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    creator: {
        type: schema.Types.ObjectId,
        ref: 'User', // Reference to the User model in user.js
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema); 

