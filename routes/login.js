const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get(
  '/',
  require('connect-ensure-login').ensureLoggedOut(),
  (req, res) => {
    res.render('login', { user: null });
  }
);

router.get(
  '/facebook',
  require('connect-ensure-login').ensureLoggedOut(),
  passport.authenticate('facebook', {
    scope: ['email', 'user_posts', 'manage_pages', 'publish_pages']
  })
);

router.get(
  '/facebook/callback',
  require('connect-ensure-login').ensureLoggedOut(),
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
