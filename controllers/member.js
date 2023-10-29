const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const User = require('./../models/user');

const MEMBERSHIP_PASSWORD = 'IWantToBeAMember';

exports.member_create_get = (req, res) => {
  if(!req.user) {
    return res.redirect('/');
  };
  
  res.render('member', {
    title: 'Member',
    user: req.user,
  });
};

exports.member_create_post = [
  body('password')
    .custom(value => value === MEMBERSHIP_PASSWORD)
    .withMessage('Incorrect Password'),
  asyncHandler(async (req, res) => {
  const error = validationResult(req);
  
  if(!error.isEmpty()) {
    res.render('member', {
      title: 'Member',
      user: req.user,
      error: error.mapped(),
    });
    return
  };
  
  await User.findByIdAndUpdate(req.user._id, { isMember: true });
  res.redirect('/');
})
];