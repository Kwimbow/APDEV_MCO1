const router = require('express').Router();
const Comment = require('../models/Comment');

// create comment
router.post('/', async (req, res) => {
    const { comment } = req.body;
    const newComment = await Comment.create(comment);
    const populated = await newComment.populate('author', 'username');
    res.json({ success: true, comment: populated });
});

// get single comment
router.get('/single/:commentId', async (req, res) => {
    const comment = await Comment.findById(req.params.commentId).populate('author', 'username');
    res.json(comment);
});

// get all comments for a post
router.get('/:postId', async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
        .populate('author', 'username');
    res.json(comments);
});

// edit a comment (for editing + upv/dwv)
router.patch('/:commentId', async (req, res) => {
    const { content, votes } = req.body;
    const update = {};
    if (content !== undefined) { update.content = content; update.edited = true; }
    if (votes !== undefined) update.votes = votes;
    await Comment.findByIdAndUpdate(req.params.commentId, update);
    res.json({ success: true });
});

// delete a comment
router.delete('/:commentId', async (req, res) => {
    await Comment.findByIdAndUpdate(req.params.commentId, { deleted: true });
    res.json({ success: true });
});

module.exports = router;