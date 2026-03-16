const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB worken!"))
  .catch((err) => console.error("MongoDB error: ", err));

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});