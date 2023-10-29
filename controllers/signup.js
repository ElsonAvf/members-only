const {
  body,
  validationResult,
  matchedData,
} = require('express-validator');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('./../models/user');

exports.signup_post = [
  body('firstName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('First Name must have at least 3 characters')
    .escape(),
  body('lastName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Last Name must have at least 3 characters')
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Username must have at least 6 characters')
    .toLowerCase()
    .custom(async value => {
      const exists = await User.findOne({ username: value });
      if(exists) throw new Error('This username is already being used');
    })
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must have at least 6 characters')
    .escape(),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Incorrect Password'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      isMember: false,
      isAdmin: false,
    });

    if (!errors.isEmpty()) {
      res.render('signup', {
        title: 'Sign Up',
        user,
        errors: errors.mapped()
      });
      return;
    };

    bcrypt.hash(req.body.password, 10, async (error, hashedPassword) => {
      if (error) {
        res.render('signup', {
          title: 'Sign Up',
          user,
          errors: { global: error },
        });
        return
      };
      user.password = hashedPassword;
      await user.save()
    });
    res.redirect('/login')
  })
];
