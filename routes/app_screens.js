const appScreenController = require("../controller/app_screens.js");
const { check, validationResult } = require('express-validator');
var usersModel = require('../models/usersModel');
module.exports = function (app, express) {
	var Router = express.Router();

	Router.use(function (req, res, next) {
		if((req.path == '/welcome_screen' ||
			req.path == '/tutorial_screen' ||
			req.path == '/signup_signin_selection' ||
			req.path == '/choose_set_up'
		) && req.method === 'POST') {
			var data = {
	            device_type: req.body.device_type,
	            unique_device_id: req.body.unique_device_id,
	            screen_name: req.body.screen_name,
	        }
			for (var key in data) {
	            if (data[key] == undefined || data[key] == 'undefined' || data[key] == null || data[key] == 'null' || data[key] == '')
	                return res.json({
	                    code: "201",
	                    result: false,
	                    status: "Error",
	                    message: 'mandatory field ' + key + ' is missing'
	                }).status(201);
	        }
	        usersModel.saveScreenTrackingLog(req.body, (err, data) => {
			    
		  	});
		  	next();
		}else{
			next();
		}
	});
	Router.post("/welcome_screen",[
	  check('dimension').exists({ checkFalsy: true }),
	  check('device_type').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], appScreenController.welcome_screen);

	Router.post("/tutorial_screen",[
	  check('dimension').exists({ checkFalsy: true }),
	  check('device_type').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], appScreenController.tutorial_screen);

	Router.post("/signup_signin_selection",[
	  check('dimension').exists({ checkFalsy: true }),
	  check('device_type').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], appScreenController.signup_signin_selection);

	Router.post("/choose_set_up",[
	  check('dimension').exists({ checkFalsy: true }),
	  check('device_type').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], appScreenController.choose_set_up);

	Router.post("/get_quick_setup",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.get_quick_setup);

	Router.post("/push_slots_for_complete",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.push_slots_for_complete);

	Router.post("/save_enabled_notification",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('is_notification_enabled').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.save_enabled_notification);

	Router.post("/complete_setup_questions",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.complete_setup_questions);

	Router.post("/selected_category_questions",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('category_id').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.selected_category_questions);

	Router.post("/get_ladder_screen",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.get_ladder_screen);

	Router.post("/app_drawer_permission",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.app_drawer_permission);

	Router.post("/push_notification_screen",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.push_notification_screen);

	Router.post("/storage_permission_screen",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.storage_permission_screen);

	Router.post("/complete_setup_category",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.complete_setup_category);

	Router.post("/save_question_option",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('question_id').exists({ checkFalsy: true }),
	  check('option_id').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.save_question_option);

	Router.post("/save_question_option_by_cat",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('question_id').exists({ checkFalsy: true }),
	  check('option_id').exists({ checkFalsy: true }),
	  check('category_id').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.save_question_option_by_cat);

	Router.post("/save_quick_setup_screen",[
	  check('access_token').exists({ checkFalsy: true }),
	  check('goals_id').exists({ checkFalsy: true }),
	  check('device_type').exists({ checkFalsy: true }),
	  check('morning_notification').exists({ checkFalsy: true }),
	  check('midday_notification').exists({ checkFalsy: true }),
	  check('evening_notification').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.save_quick_setup_screen);

	Router.post("/save_complete_setup_screen",[
	  check('access_token').exists({ checkFalsy: true }),
	  check('goals_id').exists({ checkFalsy: false }),
	  check('parent_cat_id').exists({ checkFalsy: true }),
	  check('device_type').exists({ checkFalsy: true }),
	  check('morning_notification').exists({ checkFalsy: true }),
	  check('midday_notification').exists({ checkFalsy: true }),
	  check('evening_notification').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.save_complete_setup_screen);

	Router.post("/user_screens_activity_tracker",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	],appScreenController.user_screens_activity_tracker);

	Router.post("/camera_permission_screen",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.camera_permission_screen);

	Router.post("/gallery_permission_screen",[
	  check('device_type').exists({ checkFalsy: true }),
	  check('dimension').exists({ checkFalsy: true }),
	  check('access_token').exists({ checkFalsy: true }),
	  check('unique_device_id').exists({ checkFalsy: true }),
	  check('screen_name').exists({ checkFalsy: true })
	], isAuthenticated,appScreenController.gallery_permission_screen);

	Router.post("/is_email_exist",[
	  check('email').exists({ checkFalsy: true }),
	],appScreenController.is_email_exist);
	
	return Router;
}

function isAuthenticated(req, res, next) {
	var returnObj = {};
	returnObj.result   = false;
	returnObj.code     = "201";
	returnObj.message  = "Something went wrong please try again!";
	returnObj.status   = "Error";
	if(typeof req.body.access_token != 'undefined' && req.body.access_token != '' && req.body.access_token != null){
      	usersModel.isAuthenticated(req.body, (err, data) => {
		    if (err){
		      res.status(201).send(returnObj);
		    }else{
		      if(data.length > 0){
		      	res.locals.authenticated_user = data[0];
		      	next();
		      }else{
		      	returnObj.message  = "Wrong access token";
    			res.status(201).send(returnObj);
		      }
		    }
	  	});
    }else{
    	returnObj.message  = "Required fields can not be empty.";
    	res.status(201).send(returnObj);
    }
};



