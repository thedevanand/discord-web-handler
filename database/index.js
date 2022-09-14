const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schemas and Models can be defined here

const UserSchema = new Schema({
    id: String,
    username: String,
    discriminator: String,
    avatar: String,
    balance: Number,
    bank: Number,
    inventory: Array,
});

module.exports = { User: mongoose.model('User', UserSchema) }