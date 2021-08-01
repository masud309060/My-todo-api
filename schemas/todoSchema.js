const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ["active", "inactive"]
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }
})

// Create instance method
todoSchema.methods = {
    findActive: function() {
        return mongoose.model("Todo").find({ status: 'active'});
    },
    findInActive: function(callback) {
        return mongoose.model("Todo").find({ status: 'inactive'}, callback);
    }
}

// create static method
todoSchema.statics = {
    findByJs: function(word) {
        const re = new RegExp(word, 'i')
        return this.find({title: re })
    }
}

// create Query helpers
todoSchema.query = {
    byLanguage: function(word) {
        const re = new RegExp(word, 'i');
        return this.find({title: re })
    }
}

module.exports = todoSchema;