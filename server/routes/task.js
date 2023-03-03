const express = require('express');

const Task = require('../models/task');
const { route } = require('./user');
const router = express.Router();
const authz = require('../middleware/authz');

// post method-------------------
router.post('/tasks',authz,async(req,res)=>{
   const task = new Task({
    ...req.body, 
    "owner" : req.user._id});
    //{
//         title : 'task2',
//         description:'that will be start',
     
//     }

    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
});

// ---------- get all task for one user
router.get("/tasks/all/me",authz, async(req,res) =>{  
    // const _id = req.params.id; // this should be owenr id
    const _id = req.params.id;
   try {
    const tasks = await Task.find({owner:_id});
    if(!tasks){
        return res.status(404).send('invalid user')
         
    }
    return res.status(200).send(tasks);
   } catch (error) {
        res.status(400).send(error);
   }
});
//---- get method-------------- get single task
router.get("/tasks/single/:id",authz, async(req,res) =>{
        const _id = req.params.id; // this is qnique id 
       try {
        const tasks = await Task.findOne({_id,"owner":req.user._id});
        if(!tasks){
            return res.status(404).send('invalid user');             
        }
        return res.status(200).send(tasks);
       } catch (error) {
            res.status(400).send(error);
       }
});

//update task
router.patch("/tasks/update/:id",authz, async(req,res) =>{

    // body validation part ---------
    const update = Object.keys(req.body);
    const allowUpdates = ["description", "completed"];
    const isValidOperation = update.every((update)=>{
        return allowUpdates.includes(update);
    });
    if(!isValidOperation){
        res.send({Error: "INVALID OPERATION"});
    }
 // if body valided the update task
    try {
        const updateTask = await Task.findByIdAndUpdate(
            req.params.id,
        req.body,{new:true});
        if(!updateTask){
            res.status(404).send('not found');
        }
        return res.status(200).send(updateTask);
    } catch (error) {
        res.status(400).send();
    }
});
// delete task
router.delete("/tasks/delete/:id",authz, async(req,res) =>{
    const deletetask = await Task.findByIdAndDelete({_id: req.params.id,
                "owner":req.user._id
    });
    try {
        if(!deletetask){
            return res.status(404).send('not found!')
        }
        return res.status(200).send("Deleted!");
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;