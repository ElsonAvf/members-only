const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Message = require('./../models/message');

exports.message_create_get = (req, res) => {
  if (req.user) {
    return res.render('message_form', {
      title: 'Create Message',
    });
  };
  res.redirect('/');
};

exports.message_create_post = [
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Title must have at least 3 character')
    .isLength({ max: 20 })
    .withMessage('Title must have a maximum of 20 characters')
    .escape(),
  body('message')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Message must have at least 3 character')
    .isLength({ max: 100 })
    .withMessage('Message must have a maximum of 100 characters')
    .escape(),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    
    const message = new Message({
      author: req.user.id,
      title: req.body.title,
      message: req.body.message,
    });
    
    if(!errors.isEmpty()) {
      res.render('message_form', {
        title: 'Create Message',
        message,
        errors: errors.mapped(),
      });
      return;
    };
    
    await message.save();
    res.redirect('/');
  })
];

exports.message_delete = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id).populate('author').exec();
  if(req.user.isAdmin && req.user._id.equals(message.author._id)) {
    await message.deleteOne();
  };
  res.redirect('/')
});
