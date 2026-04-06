const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	postID: {type: String, required: true},
	author: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: "User" },
	title: { type: String, required: true },
	content: { type: String, required: true },
	createdAt: { type: Date, required: true, default: () => Date.now() },
	tag: { type: String, required: true },
	score: { type: Number, required: true, default: 0 }, 
	edited:{ type: Boolean, required: true, default: false},
	
	upvotedBy: [{ type: mongoose.SchemaTypes.ObjectId, default: [], ref: "User"  }],
	downvotedBy: [{ type: mongoose.SchemaTypes.ObjectId, default: [], ref: "User"  }]
});

module.exports = mongoose.model('Post', postSchema);