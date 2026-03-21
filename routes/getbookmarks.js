const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.get( '/', async (req, res) => {

    const user = await User.findById(req.query.userid).select('bookmarks');

    const matchingPosts = await Post.find({
        postID: { $in: user.bookmarks}
    }).populate('author', 'username pfp');
    
    res.json(matchingPosts);

});


module.exports = router;
