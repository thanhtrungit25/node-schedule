const express = require('express');
const path = require('path');
const fs = require('fs');
const randomString = require('random-string');
const router = express.Router();
const User = require('../database/Schema').User;
const Post = require('../database/Schema').Post;
const FB = require('fb');
const middleware = require('connect-ensure-login');

router.get('/pages', middleware.ensureLoggedIn(), (req, res) => {
  User.findOne({ facebookID: req.user.id }, (err, user) => {
    if (err) return;
    FB.setAccessToken(user.accessToken);
    FB.api('/me/accounts', pages => {
      let data = pages.data.map(page => {
        return {
          name: page.name,
          id: page.id
        };
      });
      res.json([...data]);
    });
  });
});

router.get('/posts', middleware.ensureLoggedIn(), (req, res) => {
  Post.find(
    {
      user_id: req.user.id,
      published: req.query.published
    },
    null,
    { sort: { schedule_time: 1 } },
    (err, posts) => {
      res.json(posts);
    }
  );
});

router.delete('/schedule', middleware.ensureLoggedIn(), (req, res) => {
  Post.findOneAndRemove(req.query.id, (err, post) => {
    if (post.type_of === 'photo') {
      fs.unlink(path.join(__dirname, '..', post.media), err => {
        if (err) return console.log(err);
        res.json({ done: true });
      });
    } else {
      res.json({ done: true });
    }
  });
});

router.post('/schedule/publish', middleware.ensureLoggedIn(), (req, res) => {
  Post.findById(req.body.id, (err, post) => {
    let options = {};

    if (post.type_of === 'photo') {
      // photo
      options = Object.assign(
        options,
        {
          source: fs.createReadStream(path.join(__dirname, '../', post.media)),
          caption: post.message,
          api_endpoind: post.page_id + '/photos'
        },
        options
      );
    } else {
      // message
      options = Object.assign(
        options,
        {
          message: post.message,
          api_endpoind: post.page_id + '/feed'
        },
        options
      );
    }

    User.findOne({ facebookID: req.user.id }, (err, user) => {
      if (err) return;
      FB.setAccessToken(user.accessToken);
      FB.api('/me/accounts', pages => {
        let page = pages.data.filter(page => {
          return page.id === post.page_id;
        })[0];

        options = Object.assign(
          options,
          {
            access_token: page.access_token
          },
          options
        );

        publishPost(options, post, res);
      });
    });
  });
});

const publishPost = (options, post, response) => {
  FB.api(options.api_endpoind, 'post', options, res => {
    if (!res || res.error) {
      console.log(!res ? 'error occured' : res.error);
      return;
    }
    let update = { published: true, publish_id: res.id };
    let options = { new: true };
    Post.findByIdAndUpdate(post._id, update, options, function(error, result) {
      if (error) return;
      response.json({
        published: true
      });
    });
  });
};

router.post('/schedule', middleware.ensureLoggedIn(), (req, res) => {
  // console.log(req);
  let file = req.files ? req.files.file : null;
  let message = req.body.message;
  let date = req.body.date;
  let type = !file ? 'text' : 'photo';
  let page_id = req.body.page_id;
  let page_name = req.body.page_name;
  let options = { new: true, safe: true, upsert: true };
  let uri = !file
    ? ''
    : '/media/' +
      randomString({ length: 20 }) +
      '.' +
      file.name.split('.').pop();
  let post = {
    user_id: req.user.id,
    message: message,
    media: uri,
    schedule_time: date,
    published: false,
    page_id: page_id,
    page_name: page_name,
    type_of: type
  };
  let query = { facebookID: req.user.id };
  if (file) {
    let storage_path = path.join(__dirname, '../', uri);
    file.mv(storage_path, err => {
      if (err) {
        res.json(err);
      } else {
        createPost(query, options, post, res);
      }
    });
  } else {
    createPost(query, options, post, res);
  }
});

const createPost = (query, options, post, res) => {
  let new_post = new Post(post);
  new_post.save(function(err, doc) {
    if (err) res.json({ error: err });
    res.json({
      error: false,
      post
    });
  });
};

module.exports = router;
