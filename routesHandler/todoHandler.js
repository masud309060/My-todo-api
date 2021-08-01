const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const todoSchema = require('../schemas/todoSchema');
const userSchema = require('../schemas/userSchema');
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);
const checkLogin = require('../middlewares/checkLogin');

// GET ALL THE TODOS with user authorization
router.get('/', checkLogin, (req, res) => {
    Todo.find({status: "active"})
    .populate("user", "name username -_id")
    .select({
        _id: 0,
        date: 0
    })
    .limit(10)
    .exec((err, data) => {
        if(err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(200).json({
                result: data,
                message: "Success"
            })
        }
    })
});

// Get title with js words
router.get('/js', async (req, res) => {
    try {
        const data = await Todo.findByJs('js')
        res.status(200).json({
            result: data,
            message: 'Success'
        })
    } catch(err) {
        res.status(500).json({
            error: err.message
        })
    }

})

// GET active status todos
router.get('/active', async (req, res) => {
    try {
        const todo = new Todo();
        const data = await todo.findActive();
        res.status(200).json({
            result: data,
            message: 'Success'
        })
    } catch(err) {
        if(err) {
            res.send(500).json({
                error: err.message
            })
        }
    }

})

// GET inActive status todos by callback pattern
router.get('/inactive', (req, res) => {
    const todo = new Todo();
    todo.findInActive((err, data) => {
        if(err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(200).json({
                result: data,
                message: "Success"
            })
        }
    })
})

// Get Todo by language
router.get('/language', async (req, res) => {
    try {
        const data = await Todo.find().byLanguage('node');
        res.status(200).json({
            result: data,
            message: 'Success'
        })
    } catch (err) {
        res.status(200).json({
            result: data,
            message: "Success"
        })
    }
})

// GET A  TODO by id
router.get('/:id', async (req, res) => {
    try {
        const data = await Todo.find({_id: req.params.id});
        res.status(200).json({
            result: data,
            message: "Success"
        })
    } catch(err) {
        if(err) {
            res.status(500).json({
                error: err.message
            })
        }
    }
});

// POST TODO
router.post('/', checkLogin, async (req, res) => {
    const newTodo = new Todo({...req.body, user: req.userId});
    try {
        const todo = await newTodo.save();
        await User.updateOne({_id: req.userId}, {
            $push: {
                todos: todo._id
            }
        });
        
        res.status(200).json({
            message: "Todo was inserted successfully"
        })
    } catch(err) {
        if(err) {
            res.status(500).json({
                error: err.message
            })
        }
    }
})

// POST MULTIPLE TODO
router.post('/all', (req, res) => {
    Todo.insertMany(req.body, (err) => {
        if(err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(201).json({
                messsage: 'Inserted all todo successfully'
            })
        }
    })
})

// PUT TODO by id
router.put('/:id', (req, res) => {
    const updatedTodo = Todo.findOneAndUpdate({_id: req.params.id}, {
        $set: {
            status: req.body.status
        }
    },
    {
        new: true,
        useFindAndModify: false,
    }, 
    (err) => {
        if(err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(201).json({
                messsage: 'updated todo successfully'
            })
        }
    })
})

// DELETE TODO by id
router.delete('/:id', (req, res) => {
    Todo.deleteOne({_id: req.params.id}, (err) => {
        if(err) {
            res.status(500).json({
                error: err.message
            })
        } else {
            res.status(200).json({
                message: "todo was deleted successfully"
            })
        }
    })
})

module.exports = router;