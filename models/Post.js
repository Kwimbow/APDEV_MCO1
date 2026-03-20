const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	postID: {type: String, required: true},
	author: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
	title: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, required: true, default: () => Date.now() },
	tag: { type: String, required: true },
	upvotes: { type: Number, required: true, default: 0 }, 
	edited:{ type: Boolean, required: true, default: false}
	
});

module.exports = mongoose.model('Post', postSchema);