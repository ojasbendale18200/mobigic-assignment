const express = require('express');
const path = require('path');
const { connection } = require('./config/db');

require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res) => {
    res.send("hello")
})

app.listen(port, async ()=>{
    try {
        await connection;
        console.log("Connected to DB");
    } catch (err) {
        console.log(err.message);
    }
    console.log(`Server is running at port ${port}`);
})