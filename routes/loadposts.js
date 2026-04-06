const router = require('express').Router();
const Post = require('../models/Post');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.get('/', async (req, res) => {
    
    const posts = await Post.find().populate('author', 'username pfp');
    
    const userId = req.query.userId;
    

    if(userId){
        posts.forEach(post => {
            post.upvoteFlag = post.upvotedBy.includes(userId);
            post.downvoteFlag = post.downvotedBy.includes(userId);
        });
    }
    
    res.json(posts);


});


module.exports = router;
