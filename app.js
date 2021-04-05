const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {itemSchema} = require('./schemas.js');
const methodOverride = require('method-override');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expresserror');
const Item = require('./models/Item');

//新增這行：useFindAndModify: false
mongoose.connect('mongodb://localhost:27017/AfricanAid', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}) 

const db = mongoose.connection;
db.on("error", console.error.bind(console,"cennection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const validateItem = (req, res, next) => {
        const {error} = itemSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',')
            throw new ExpressError(msg, 400)
        } else {
            next();
        }
}

app.get('/', (req, res) =>{
    res.render('home')
});

//新增story page
app.get('/items/story', (req, res) =>{
    res.render('items/story')
});

//新增Account page
app.get('/items/account', (req, res) =>{
    res.render('items/account')
});

//新增Login page
app.get('/items/loginpage', (req, res) =>{
    res.render('items/loginpage')
});

app.get('/items', catchAsync(async(req, res) =>{
    const items = await Item.find({})
    res.render('items/index', { items });
}));

app.get('/items/uploadpage', (req, res) => {
    res.render('items/uploadpage');
});

app.post('/items', validateItem, catchAsync(async(req, res, next) => {
    const item = new Item(req.body.item);
    await item.save();
    res.redirect(`/items/${item._id}`)
}));

app.get('/items/:id', catchAsync(async(req, res) => {
    const item = await Item.findById(req.params.id)
    res.render('items/show', { item });
}));

app.get('/items/:id/edit',  catchAsync(async(req, res) => {
    const item = await Item.findById(req.params.id)
    res.render('items/edit', { item });
}));

app.put('/items/:id', validateItem, catchAsync(async (req, res) => {
    const { id } =req.params; 
    const item = await Item.findByIdAndUpdate(id,{ ...req.body.item});
    res.redirect(`/items/${item._id}`)
}));

app.delete('/items/:id',  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Item.findByIdAndDelete(id);
    res.redirect('/items');
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next)=> {
    const {statusCode = 500} = err;
    if (!err.messsage) err.messsage = 'Oh no. sth went wrong!'
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})