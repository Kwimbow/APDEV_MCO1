const router = require('express').Router();
const Post = require('../models/Post');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.get( '/', async (req, res) => {
    
    const searchTerm = req.query.term;

    if (searchTerm == ""){
        const posts = await Post.find().populate('author', 'username');
        res.json(posts);
    }
    else{
        const matchingPosts = await Post.find({
            $or: [
                {content: {$regex: searchTerm, $options: 'i'}},
                {title: {$regex: searchTerm, $options: 'i'} }
            ]
        });
        
        res.json(matchingPosts);
    }
});


module.exports = router;