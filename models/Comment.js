const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	author: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
	post: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "Post" },
	content: { type: String, required: true },
	createdAt: { type: Date, required: true, default: () => Date.now() },
	score: { type: Number, required: true, default: 0 },
	parent_id: {type: mongoose.SchemaTypes.ObjectId, ref: "Comment", default: null},
	edited:  { type: Boolean, required: true, default: false },
	deleted: { type: Boolean, default: false },
	upvotedBy: [{ type: mongoose.SchemaTypes.ObjectId, default: [], ref: "User"  }],
	downvotedBy: [{ type: mongoose.SchemaTypes.ObjectId, default: [], ref: "User"  }]
});

module.exports = mongoose.model('Comment', commentSchema);