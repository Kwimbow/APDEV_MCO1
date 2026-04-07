const express = require('express');
const path = require('path');
require('dotenv').config();
const connectDB = require('./db');

const app = express();

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  }
  catch (err) {
    console.error('Mongoose not worken: ', err);
    res.status(500).json({error: 'Database not workn'});
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// getting le schema
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// getting le routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
const postRoutes = require('./routes/authpost');
app.use('/api', postRoutes);
const loadRoutes = require('./routes/loadposts');
app.use('/api/posts', loadRoutes);
const commentRoutes = require('./routes/authcomments');
app.use('/api/comments', commentRoutes);

const searchRoutes = require('./routes/searchposts');
app.use('/api/search', searchRoutes);
const filterRoutes = require('./routes/filterposts');
app.use('/api/filter', filterRoutes);
const bookmarkRoutes = require('./routes/savebookmarks');
app.use('/api/bookmarks', bookmarkRoutes);
const getBookmarkRoutes = require('./routes/getbookmarks');
app.use('/api/getbookmarks', getBookmarkRoutes);

const votingRoutes = require('./routes/voting');
app.use('/api/voting', votingRoutes);


module.exports = app;