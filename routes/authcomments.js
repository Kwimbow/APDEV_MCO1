const router = require('express').Router();
const Comment = require('../models/Comment');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.post('/', async (req, res) => {
    const { comment } = req.body;

    await Comment.create(comment);
    res.json({ success: true });
});


module.exports = router;