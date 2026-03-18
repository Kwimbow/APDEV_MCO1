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

/* This function logs in the user. */
router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username, password });
	if (!user) {
		return res.status(400).json({ message: "Invalid username or password "});
	}

	res.json({ success: true, _id: user._id, username: user.username });
});

/* This function returns the userID of the current user */
router.post('/curr_user', async (req, res) => {
	const { username } = req.body;

	const user = await User.findOne({ username });
	if (!user) {
		return res.status(400).json({ message: "Error, no curent logged in user or no user with this username type shit "});
	}

	res.json({ success: true, _id: user._id, username: user.username });
})

module.exports = router;