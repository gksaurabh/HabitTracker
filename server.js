const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const config = require('./config.js');
let ToDoItems = require('./models/todoModel');

const PORT = process.env.PORT || 8000;

let db;
app.locals.db = db;

const trackRouter = require('./routes/router.js');

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req,_,next)=> {
    console.log(`${req.method}: ${req.url}`);
    if (Object.keys(req.body).length > 0){
        console.log('Body:');
        console.log(req.body);
    }
    next();
});


app.use("/track", trackRouter);
//Start the connection to the database
mongoose.connect(config.db.host, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default Mongoose connection (can then be shared across multiple files)
db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //We're connected
  console.log("Connected to the database...");
  // Intialize the todo items collection in the database
  ToDoItems.find({}, function (err, result){
        if (err){console.log(err);}
        else{
            console.log("Result :", result);
            app.listen(PORT, ()=> {
                console.log(`Server listening on http://localhost:${PORT}`)
            });
        }
    });
});

// terminates a connection to the database when the node application finishes
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
      console.log('Mongoose disconnected through app termination');
      process.exit(0);
    });
});