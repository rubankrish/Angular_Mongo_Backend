const express = require('express');
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const postsRoutes= require("./routes/post");
const app=express();
const path=require("path");
mongoose
  .connect(
    "mongodb+srv://ruban:mnJWdClLlEGNaXkB@cluster0-lagqv.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept"
    );
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
  next();
});

app.use('/api/posts',postsRoutes);

module.exports=app;
