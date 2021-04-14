const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const users = require("./users.js");
const User = users.model;
const photos = require("./photos.js");
const Photo = photos.model;
const validUser = users.valid;

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Photo'
  },
  comment: String,
  created: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', commentSchema);

//upload comment
router.post('/:id', validUser, async (req, res) => {
  try {
      let photo = await Photo.findOne({_id: req.params.id});
      if (!photo) {
          res.send(404);
          return;
      }
      let comment = new Comment({
        comment: req.body.comment,
        user: req.user,
        photo: photo,
      });
      await comment.save();
      res.send(comment);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

router.get('/:id', async (req, res) => {
  try {
      let photo = await Photo.findOne({
        _id: req.params.id,
      });
      if (!photo) {
          res.send(404);
          return;
      }
      let comments = await Comment.find({
        photo: photo,
      }).populate("user");
      //console.log(comments);
      res.send(comments);
  } catch (error) {
      console.log(error);
      res.sendStatus(500);
  }
});

module.exports = {
    model: Comment,
    routes: router,
  }