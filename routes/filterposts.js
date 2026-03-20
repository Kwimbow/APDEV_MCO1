const router = require('express').Router();
const Post = require('../models/Post');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.get( '/', async (req, res) => {
    
    const tag = req.query.term;

    if (tag == ""){
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    }

    else{
        const matchingPosts = await Post.find({
            $or: [
                {tag: {$regex: tag, $options: 'i'}}
            ]
        });
        
        res.json(matchingPosts);
    }
});


module.exports = router;