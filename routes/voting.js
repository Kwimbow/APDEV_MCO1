const router = require('express').Router();
const Post = require('../models/Post');


router.patch('/save_upvote', async (req, res) => {
    const {userID, postID} = req.body;
    console.log("Test uv")

    const post = await Post.findById(postID);

    if(post.downvotedBy.includes(userID)){
        await Post.findOneAndUpdate(
            {_id: postID},
            {
                $addToSet: {upvotedBy: userID},
                $pull: {downvotedBy: userID},
                $inc: {score: 2}
            }
        ); 
    }
    
    else{
        if(post.upvotedBy.includes(userID)){
            await Post.findOneAndUpdate(
                {_id: postID},
                {
                    $pull: {upvotedBy: userID},
                    $inc: {score:-1}
                }
            )
        }
        else{
            await Post.findOneAndUpdate(
                {_id: postID},
                {
                    $addToSet: {upvotedBy: userID},
                    $inc: {score: 1}
                }
            );
        } 
    }

    res.json({ success: true });
});

router.patch('/save_downvote', async (req, res) => {
    const {userID, postID} = req.body;
    console.log("Test dv")

    const post = await Post.findById(postID);

    if(post.upvotedBy.includes(userID)){
        await Post.findOneAndUpdate(
            {_id: postID},
            {
                $addToSet: {downvotedBy: userID},
                $pull: {upvotedBy: userID},
                $inc: {score: -2}
            }
        ); 
    }
    
    else{
        if(post.downvotedBy.includes(userID)){
            await Post.findOneAndUpdate(
                {_id: postID},
                {
                    $pull: {downvotedBy: userID},
                    $inc: {score:1}
                }
            )
        }
        else{
            await Post.findOneAndUpdate(
                {_id: postID},
                {
                    $addToSet: {downvotedBy: userID},
                    $inc: {score: -1}
                }
            );
        } 
    }

    res.json({ success: true });
});



module.exports = router;