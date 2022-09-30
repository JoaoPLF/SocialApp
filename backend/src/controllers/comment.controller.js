const Comment = require("../models/comment.model");
const checkRequiredFields = require("../utils/checkRequiredFields");
const errorLogger = require("../utils/errorLogger");
const returnWithProfileImage = require("../utils/returnWithProfileImage");
const ValidationError = require("../utils/ValidationError");

exports.getComments = async (postId) => {
  try {
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    return await Promise.all(comments.map(returnWithProfileImage));
    
  }
  catch (err) {
    errorLogger(err, "Could not get comments.");
  }
};

exports.createComment = async ({ userHandle, postId, body }) => {
  try {
    if (!checkRequiredFields({ body })) {
      throw new ValidationError("Comment must not be empty.");
    }

    const comment = new Comment({ userHandle, postId, body });
    await comment.save();

    return await returnWithProfileImage(comment);
  }
  catch (err) {
    errorLogger(err, "Could not create comment.");
  }
};