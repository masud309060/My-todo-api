const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userSchema = require('../schemas/userSchema');
const User = new mongoose.model("User", userSchema);

// SIGN UP 
router.post('/signup', async (req, res) => {
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword,
        })
        await newUser.save();
        res.status(200).json({
            message: 'Signup was Successful!'
        })
    } catch(err) {
        res.status(500).json({
            error: err.message
        })
    }
})

// SIGN IN 
router.get('/login', async(req, res) => {
    try {
        const user = await User.find({username: req.body.username});
        if(user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            
            if(isValidPassword) {
                // generate token 
                const token = await jwt.sign({
                    name: user[0].name,
                    username: user[0].username,
                    userId: user[0]._id
                }, process.env.SECRET_KEY , { expiresIn: '1h' })
                
                res.status(200).json({
                    "access_token": token,
                    "message": "login successful!"
                })
    
            } else {
                res.status(401).json({
                    error: "Authentication failure!"
                })
            }
        } else {
            res.status(401).json({
                error: "Authentication failure!"
            })
        }
    } catch {
        res.status(401).json({
            error: "Authentication failed!"
        })
    }
})

// GET ALL USER 
router.get('/all', async (req, res) => {
    try {
        const users = await User.find().populate("todos", "title description")

        res.status(200).json({
            data: users,
            message: "Success"
        })
    } catch {
        res.status(500).json({
            error: "There is problem in server"
        })
    }
})

module.exports = router;