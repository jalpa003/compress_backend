const express = require('express');
const app  = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3030;
const UserRoutes = require('./src/routes/user_routes');

app.use(express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.listen(PORT, ()=> console.log("started"));
app.use("/api/user",UserRoutes);

mongoose.connect("mongodb+srv://mafiamundeerking:compressapp@cluster0.aoqocuh.mongodb.net/?retryWrites=true&w=majority");

app.get("/",function(req,res){
    res.send(PORT);
});
