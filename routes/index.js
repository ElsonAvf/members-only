const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Message = require('./../models/message');
const { signup_post } = require('./../controllers/signup');
const {
  message_create_get,
  message_create_post,
  message_delete,
} = require('./../controllers/message');
const {
  member_create_get,
  member_create_post,
} = require('./../controllers/member');
const {
  admin_create_get,
  admin_create_post,
} = require('./../controllers/admin');

router.get('/', asyncHandler(async (req, res, next) => {
  const messages = await Message
    .find({})
    .populate('author')
    .sort({ createdAt: -1 })
    .exec();
  res.render('index', {
    title: 'Home',
    user: req.user,
    messages,
  });
}));

router.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' })
});

router.post('/signup', signup_post);

router.get('/login', (req, res) => {
  res.render('login', { title: 'Log In' })
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/', failureRedirect: '/'
}));

router.get('/logout', (req, res) => {
  req.logout(error => {
    if (error) return next(error);
    res.redirect('/');
  });
});

router.get('/message', message_create_get);

router.post('/message', message_create_post);

router.get('/message/:id/delete', message_delete);

router.get('/member', member_create_get);
router.post('/member', member_create_post);

router.get('/admin', admin_create_get)
router.post('/admin', admin_create_post)

module.exports = router;
