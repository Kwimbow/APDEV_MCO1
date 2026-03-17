const router = require('express').Router();
const User = require('../models/User');

/* This function registers the user.
	Can return an error if there is another user with the inputted username.*/
router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	const notUnique = await User.findOne({ username });
	if (notUnique) {
		return res.status(400).json({message: 'Username already exists' });
	}

	await User.create({ username, password });
	res.json({ success: true });
});

module.exports = router;