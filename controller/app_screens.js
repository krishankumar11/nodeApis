var usersModel = require('../models/usersModel');
const { check, validationResult } = require('express-validator');
// Get App screen Content
exports.welcome_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.getWelcomeScreen(req.body, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.tutorial_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.getTutorialScreen(req.body, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.signup_signin_selection = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.signupSigninSelection(req.body, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.choose_set_up = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.chooseSetUpScreen(req.body, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.get_quick_setup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.getQuickSetup(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.push_slots_for_complete = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.push_slots_for_complete(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.save_enabled_notification = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.save_enabled_notification(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.complete_setup_questions = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.complete_setup_questions(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.selected_category_questions = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.selected_category_questions(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.get_ladder_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.get_ladder_screen(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.app_drawer_permission = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.app_drawer_permission(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.push_notification_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.push_notification_screen(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.storage_permission_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.storage_permission_screen(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.complete_setup_category = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.complete_setup_category(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.save_question_option = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.save_question_option(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.save_question_option_by_cat = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.save_question_option_by_cat(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.save_quick_setup_screen = (req, res) => {
  const errors = validationResult(req);
  console.log('Hittt');
  if (!errors.isEmpty()) {
    console.log('inside loop');
    console.log(errors.array());
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.save_quick_setup_screen(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.save_complete_setup_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.save_complete_setup_screen(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.user_screens_activity_tracker = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.user_screens_activity_tracker(req.body, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.camera_permission_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.camera_permission_screen(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.gallery_permission_screen = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.gallery_permission_screen(req.body,res.locals.authenticated_user, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};

exports.is_email_exist = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    var requiredErrObj = {};
    requiredErrObj.result   = false;
    requiredErrObj.code     = "201";
    requiredErrObj.message  = "Required fields can not be empty.";
    requiredErrObj.status   = "Error";
    return res.send(requiredErrObj);
  }
  usersModel.is_email_exist(req.body, (err, data) => {
    if (err){
      var errObj = {};
      errObj.result   = false;
      errObj.code     = "201";
      errObj.message  = "Something went wrong please try again!";
      errObj.status   = "Error";
      res.status(201).send(errObj);
    }else{
      return res.send(data);
    }
  });
};