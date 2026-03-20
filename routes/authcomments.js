const router = require('express').Router();
const Comment = require('../models/Comment');

/* This function registers the user.
    Can return an error if there is another user with the inputted username.*/
router.post('/', async (req, res) => {
    const { comment } = req.body;
    const newComment = await Comment.create(comment);
    const populated = await newComment.populate('author', 'username');
    res.json({ success: true, comment: populated });
});

// gets all comments for a post
router.get('/:postId', async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate('author', 'username');
    res.json(comments);
});

// edit a comment
router.patch('/:commentId', async (req, res) => {
    const { content } = req.body;
    await Comment.findByIdAndUpdate(req.params.commentId, {
        content,
        edited: true
    });
    res.json({ success: true });
});

// delete a comment
router.delete('/:commentId', async (req, res) => {
    await Comment.findByIdAndUpdate(req.params.commentId, { deleted: true });
    res.json({ success: true });
});

module.exports = router;