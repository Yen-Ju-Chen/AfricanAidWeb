const express = require('express');
const cities = require('./cities');
const path = require('path');
const mongoose = require('mongoose');
const Item = require('../models/item');
const {places, descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/AfricanAid', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}) 

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Item.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20)+ 10;
        const item = new Item({
            title: `${sample(descriptors)} ${sample(places)}`,
            seller: `${cities[random1000].city}, ${cities[random1000].state}`,
            image:'https://source.unsplash.com/collection/483251',
            price,
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque facilis id rerum, maxime dignissimos provident cupiditate nostrum similique nemo ipsa, impedit minus, laborum distinctio eius ipsum ex minima. Consequatur, deserunt!',
        })
        await item.save();
    }
}

// seedDB();

seedDB().then(() => {
    mongoose.connection.close()
})

