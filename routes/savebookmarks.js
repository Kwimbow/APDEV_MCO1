const router = require('express').Router();
const User = require('../models/User');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.patch('/', async (req, res) => {
    const {user, postID} = req.body;
    console.log("Test")
    await User.findOneAndUpdate(
        {_id: user},
        {$addToSet: {bookmarks: postID}}
    )


    res.json({ success: true });
});


module.exports = router;