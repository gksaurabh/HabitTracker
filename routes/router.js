// This module is cached as it has already been loaded
const { log } = require('console');
const express = require('express');
const req = require('express/lib/request');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();

let ToDoItems = require('../models/todoModel');

app.use(express.json()); // body-parser middleware

//Chekcs if an appropriate body has been provided
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

//POST request which adds the body if validateToDoItem method returns true (body matches document format)
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

//GET request: returns all items 
router.get('/', (req,res)=>{
    res.format({
        'application/json': ()=>{
            res.set('Content-Type', 'application/json');
            ToDoItems.find(function(err, result){
                if(result === undefined){
                    res.status(404).send("To do list is empty");
                }
                else if(result !== undefined){
                    res.status(200).set("Content-Type", "application/json").json(result);
                }
                else{
                    res.status(500).send("Unkown error");
                }
            });
        }
    });
});

router.delete('/:id',(req,res)=>{
    try{
        const task = ToDoItems.find({_id: req.params.id}).remove().exec();
        res.status(200).send(task);
    }
    catch(error){
        res.status(500).send(error);
    }
});


function validateToDoItemBody(req ,res, next){
    let properties = ['name','priority'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}
router.put('/:id', validateToDoItemBody, (req,res) =>{
    ToDoItems.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}, function(error, result){
        if (error){
            console.log(error);
        }
        else if(result === undefined){
            res.status(404).send("404, Error, to do item not found");

        }
        else{
            res.status(200).send(result);
        }
    })
});



module.exports = router;