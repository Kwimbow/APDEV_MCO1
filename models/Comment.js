const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	author: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
	post: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Post" },
	content: { type: String, required: true },
	createdAt: { type: Date, required: true, default: () => Date.now() },
	upvotes: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Comment', commentSchema);