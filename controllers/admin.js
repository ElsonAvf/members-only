const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('./../models/user');

const ADMIN_PASSWORD = 'IWantToBeAnAdmin';

exports.admin_create_get = (req, res) => {
  if(!req.user) {
    return res.redirect('/');
  };
  res.render('admin', {
    title: 'Admin',
    user: req.user,
  });
};

exports.admin_create_post = [
  body('password')
    .custom(value => value === ADMIN_PASSWORD)
    .withMessage('Incorrect Password'),
  asyncHandler(async (req, res) => {
  const error = validationResult(req);
  
  if(!error.isEmpty()) {
    res.render('admin', {
      title: 'Admin',
      user: req.user,
      error: error.mapped(),
    });
    return
  };
  
  await User.findByIdAndUpdate(req.user._id, { isAdmin: true });
  res.redirect('/');
})
];