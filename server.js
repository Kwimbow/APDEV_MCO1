const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB worken!"))
  .catch((err) => console.error("MongoDB error: ", err));

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


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
