const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routesHandler/todoHandler');
const userHandler = require('./routesHandler/userHandler');

// express app initialization
const app = express();
dotenv.config();
app.use(express.json());

// database connection with mongoose
mongoose.connect('mongodb://localhost:27017/todos', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(data => console.log('connection successful'))
.catch(err => console.log(err))

// application routes
app.use('/todo', todoHandler)
app.use('/user', userHandler)

//  default err handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return (next(err))
    } else {
        res.status(500).json({ error: err})
    }
}

app.use(errorHandler);

app.listen(3000, () => {
    console.log('app listening on the port 3000')
})