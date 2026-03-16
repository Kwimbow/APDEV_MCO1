const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	bio: { type: String },
	password: { type: String, required: true },
	createdAt: {type: Date, required: true, default: () => Date.now() },
	cupcakes: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('User', userSchema);