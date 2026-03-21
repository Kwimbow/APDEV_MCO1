const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	// email: { type: String, required: true, unique: true },
	bio: { type: String },
	pfp: { type: String },
	password: { type: String, required: true },
	createdAt: {type: Date, required: true, default: () => Date.now() },
	cupcakes: { type: Number, required: true, default: 0 },
	bookmarks: {type: [String], default:[], required: true}
});

module.exports = mongoose.model('User', userSchema);
