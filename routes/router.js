// This module is cached as it has already been loaded
const express = require('express');
const req = require('express/lib/request');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();

let ToDoItems = require('../models/todoModel');

app.use(express.json()); // body-parser middleware

function validateToDoItem(req, res, next){
    let properties = ['name', 'priority'];
    for(property of properties){
        // hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
          if (!req.body.hasOwnProperty(property)){
              return res.status(400).send("Bad request");
          }
      }
      // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
      next();
}

router.post('/', validateToDoItem, (req,res)=>{
    ToDoItems.find(function(err, result){
        let newItem = new ToDoItems({
            name: req.body.name,
            priority: req.body.priority
        });

        newItem.save(function(err, result){
            if(err){
                console.log("Error adding the new task");
				console.log(err.message);
				res.status(500)
				return;
			}
			console.log("new task added");
			console.log(result);
			res.status(200).send(result);
        });
    });
});


module.exports = router;