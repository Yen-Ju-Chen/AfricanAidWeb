const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//location change to seller
const ItemSchema = new Schema({
    title: String,
    seller: String,
    image: String,
    price: Number,
    description: String,
});

module.exports = mongoose.model('Item', ItemSchema);