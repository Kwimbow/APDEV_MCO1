const router = require('express').Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment')

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


router.patch('/save_comment_upvote', async (req, res) => {
    const {userID, commentID} = req.body;
    console.log("Test comment uv ", commentID)

    const comment = await Comment.findById(commentID);

    if(comment.downvotedBy.includes(userID)){
        await Comment.findOneAndUpdate(
            {_id: commentID},
            {
                $addToSet: {upvotedBy: userID},
                $pull: {downvotedBy: userID},
                $inc: {score: 2}
            }
        ); 
    }
    
    else{
        if(comment.upvotedBy.includes(userID)){
            await Comment.findOneAndUpdate(
                {_id: commentID},
                {
                    $pull: {upvotedBy: userID},
                    $inc: {score:-1}
                }
            )
        }
        else{
            await Comment.findOneAndUpdate(
                {_id: commentID},
                {
                    $addToSet: {upvotedBy: userID},
                    $inc: {score: 1}
                }
            );
        } 
    }

    res.json({ success: true });
});

router.patch('/save_comment_downvote', async (req, res) => {
    const {userID, commentID} = req.body;
    console.log("Test dv")

    const comment = await Comment.findById(commentID);

    if(comment.upvotedBy.includes(userID)){
        await Comment.findOneAndUpdate(
            {_id: commentID},
            {
                $addToSet: {downvotedBy: userID},
                $pull: {upvotedBy: userID},
                $inc: {score: -2}
            }
        ); 
    }
    
    else{
        if(comment.downvotedBy.includes(userID)){
            await Comment.findOneAndUpdate(
                {_id: commentID},
                {
                    $pull: {downvotedBy: userID},
                    $inc: {score:1}
                }
            )
        }
        else{
            await Comment.findOneAndUpdate(
                {_id: commentID},
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