const router = require('express').Router();
const Post = require('../models/Post');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.post('/create_post', async (req, res) => {
    const { post } = req.body;

    await Post.create({post});
    res.json({ success: true });
});


module.exports = router;