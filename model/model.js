const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: { type: String, required: true },
  comment_on: Date
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [commentSchema]
});

const bookModel = mongoose.model("Book", bookSchema);
const commentModel = mongoose.model("Comment", commentSchema);

exports.bookModel = bookModel;
exports.commentModel = commentModel;