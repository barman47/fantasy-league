const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

module.exports = Post = mongoose.model('Post', PostSchema);