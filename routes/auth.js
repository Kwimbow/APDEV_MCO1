const express = require('express');                       // i edited these 2 lines to only increase
const router = express.Router();                          // the file size limit for the pfp --only.
const User = require('../models/User');
const bcrypt = require('bcrypt');


const SALT_ROUNDS = 10; // num of iterations for hashing

/* This function registers the user.
	Can return an error if there is another user with the inputted username.*/
router.post('/register', async (req, res) => {
	const { username, password } = req.body;

	const notUnique = await User.findOne({ username });
	if (notUnique) {
		return res.status(400).json({message: 'Username already exists' });
	}

	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

	await User.create({ username, password: hashedPassword });
	res.json({ success: true });
});

/* This function logs in the user. */
router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	const user = await User.findOne({ username });
	if (!user) {
		return res.status(400).json({ message: "Invalid username or password "});
	}

	const userMatch = await bcrypt.compare(password, user.password);
	if (!userMatch) {
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

/* Get user profile info by ID */
router.get('/user/:userId', async (req, res) => {
	const user = await User.findById(req.params.userId).select('username bio pfp cupcakes createdAt');
	if (!user) return res.status(404).json({ message: 'User not found' });
	res.json(user);
});


/* for the user pfp

THIS . LINE . HERE . I SPENT. 2 HOURS. WANTING TO GAME END MYSELF.
apparently the default file size limit for express is 100 mb and photos are just not. 100 mb. 
i put 

*/

router.post('/user/:userId/pfp', express.json({ limit: '10mb' }), async (req, res) => {
	const { pfp } = req.body;
	await User.findByIdAndUpdate(req.params.userId, { pfp });
	res.json({ success: true, pfp });
});

/* Update user bio */
router.patch('/user/:userId/bio', async (req, res) => {
	const { bio } = req.body;
	await User.findByIdAndUpdate(req.params.userId, { bio });
	res.json({ success: true });
});

module.exports = router;
