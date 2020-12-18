var express = require('express');
var router = express.Router();
var multer  = require('multer');
const mysql = require('mysql');
const util = require('util');
var PHPUnserialize = require('php-unserialize');
var env = require('../env');
var globalVariables = require('../global_variables')[env.instance];
var db = require('../configs/dbCredentials')[env.instance];
let dateConvert = require('date-and-time');
var asyncModule = require("async");
var moment = require('moment');

var connection = mysql.createConnection({
    host: db.host,
    user: db.username,
    password: db.password,
    database: db.database
});

connection.connect();
const fn = util.promisify(connection.query).bind(connection);

function getDimension(dimension = ''){
	if(typeof dimension == 'undefined' || dimension == ''){
        dimension = '1080';
    }else{
        if(dimension == 'mdpi'){
          dimension = '320';  
        }
        if(dimension == 'hdpi'){
          dimension = '480';  
        }
        if(dimension == 'xhdpi'){
          dimension = '720';  
        }
        if(dimension == 'xxhdpi'){
          dimension = '1080';  
        }
        if(dimension == 'xxxhdpi'){
          dimension = '1440';  
        }
    }
    return dimension;
}

module.exports = {
	is_email_exist : async function(bodyData,result){
		asyncModule.auto({
		    get_user: function(callback) {
		    	var sqlQuery = `SELECT id from users where email = "`+bodyData.email+`" AND status="1" LIMIT 1`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
			if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	if(d.get_user.length == 0){
		    		screenData.is_user_exist = 0;
		    	}else{
		    		screenData.is_user_exist = 1;
		    	}
		    	result(null, screenData);
		    } 
		});
	},
	getWelcomeScreen : async function(bodyData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	var sqlQuery = `SELECT nafsc.id,nafsc.title,nafsc.subtitle,nafsc.left_button,nafsc.right_button,nafsc.media_type,
		    					nafm.image_name media FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.screen_name = nafsc.screen_name 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'welcome_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	getTutorialScreen : async function(bodyData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	var sqlQuery = `SELECT nafsc.id,nafsc.title,nafsc.subtitle,nafsc.description,nafsc.left_button,nafsc.right_button,
		    					nafsc.media_type, nafm.image_name media FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'tutorial_screen' ORDER BY nafsc.post_order`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.left_button = (d.get_screen.length > 0 ) ? d.get_screen[0].left_button : '';
		    	screenData.right_button = (d.get_screen.length > 0 ) ? d.get_screen[0].right_button : '';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen : [];
		    	result(null, screenData);
		    } 
		});
	},
	signupSigninSelection : async function(bodyData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	var sqlQuery = `SELECT nafsc.id,nafsc.title,nafsc.subtitle,nafsc.left_button,nafsc.right_button,
		    					nafsc.media_type, nafm.image_name media FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'signup_signin_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.left_button = (d.get_screen.length > 0 ) ? d.get_screen[0].left_button : '';
		    	screenData.right_button = (d.get_screen.length > 0 ) ? d.get_screen[0].right_button : '';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen : [];
		    	result(null, screenData);
		    } 
		});
	},
	chooseSetUpScreen : async function(bodyData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	var sqlQuery = `SELECT nafsc.id,nafsc.title,nafsc.subtitle,nafsc.left_button,nafsc.right_button,
		    					nafsc.media_type, nafm.image_name media FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'choose_set_up_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.left_button = (d.get_screen.length > 0 ) ? d.get_screen[0].left_button : '';
		    	screenData.right_button = (d.get_screen.length > 0 ) ? d.get_screen[0].right_button : '';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	getQuickSetup : async function(bodyData,userData,result){
		asyncModule.auto({
		    get_free_categories: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT id,title,rounded_image FROM category WHERE status='1' 
		    					AND is_quick_setup_cat = 'no' AND category_status='free' LIMIT 2`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
			notification_time: function(callback) {
		    	var notificationTime = {
		    		morning_min:"06:00 AM",
		    		morning_max:"12:00 PM",
		    		midday_min:"01:00 PM",
		    		midday_max:"03:00 PM",
		    		evening_min:"05:00 PM",
		    		evening_max:"06:00 PM",
		    	}
		    	callback(null, notificationTime);
			}
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/cat_img/';
		    	screenData.free_categories = d.get_free_categories;
		    	screenData.notification_time = d.notification_time;
		    	result(null, screenData);
		    } 
		});
	},
	push_slots_for_complete : async function(bodyData,userData,result){
		asyncModule.auto({
		    notification_time: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var notificationTime = {
		    		morning_min:"06:00 AM",
		    		morning_max:"12:00 PM",
		    		midday_min:"01:00 PM",
		    		midday_max:"03:00 PM",
		    		evening_min:"05:00 PM",
		    		evening_max:"06:00 PM",
		    	}
		    	callback(null, notificationTime);
			}
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.notification_time = d.notification_time;
		    	result(null, screenData);
		    } 
		});
	},
	save_enabled_notification : async function(bodyData,userData,result){
		asyncModule.auto({
		    save_notification: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `UPDATE users SET is_push_enabled = "`+bodyData.is_notification_enabled+`" WHERE users.id = "`+userData.id+`"`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Notification setting saved successfully.";
		    	result(null, screenData);
		    } 
		});
	},
	complete_setup_questions : async function(bodyData,userData,result){
		asyncModule.auto({
			get_questions: function(callback) {
				module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT id,title,subtitle FROM new_flow_questions WHERE status = '1' and category_id = ''`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
			get_question_data:['get_questions',function(results,callback){
				if(results.get_questions.length > 0){
					var cat_arr = [];
					asyncModule.each(results.get_questions, function(singleQues, callbackInner) {
						var sqlQuerySubCat = `SELECT id,title,'no' as is_selected FROM new_flow_questions_options WHERE question_id="`+singleQues.id+`" and category_id = ''`;
				    	connection.query(sqlQuerySubCat, (errInner, resInnner) => {
						    if (errInner) {
						      	callbackInner(errInner);
						    }else{
						    	var sqlQCheckSelated = 'SELECT option_id from new_flow_questions_answers_log where user_id = ? AND question_id = ? ORDER BY ID DESC LIMIT 1'
								var whereCond = [userData.id,singleQues.id];
								connection.query(sqlQCheckSelated,whereCond, (errInner, resPonse) => {
									if(resPonse.length > 0){
										for (var i = 0; i < resInnner.length; i++) {
											if(resPonse[0].option_id == resInnner[i].id){
												resInnner[i].is_selected = 'yes';
											}else{
												resInnner[i].is_selected = 'no';
											}
										}
										singleQues.options_array = resInnner;
								    	cat_arr.push(singleQues);
								    	callbackInner(null);		
									}else{
										singleQues.options_array = resInnner;
								    	cat_arr.push(singleQues);
								    	callbackInner(null);		
									}
								    
								});
						    }
						});
					}, function(err) {
					    if( err ) {
					    	callback(null,[])
					    } else {
					    	callback(null,cat_arr)
					    }
					});
				}else{
					callback(null,[])
				}
			}]
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Questions loaded successfully.";
		    	screenData.questions = d.get_question_data;
		    	result(null, screenData);
		    } 
		});
	},
	selected_category_questions : async function(bodyData,userData,result){
		asyncModule.auto({
		    get_questions: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT id,title,category_id FROM new_flow_questions WHERE status = '1' and category_id = "`+bodyData.category_id+`" `;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
			get_question_data:['get_questions',function(results,callback){
				if(results.get_questions.length > 0){
					var cat_arr = [];
					asyncModule.each(results.get_questions, function(singleQues, callbackInner) {
						var sqlQuerySubCat = `SELECT id,title,category_id,'no' as is_selected FROM new_flow_questions_options WHERE question_id="`+singleQues.id+`"`;
				    	connection.query(sqlQuerySubCat, (errInner, resInnner) => {
						    if (errInner) {
						      	callbackInner(errInner);
						    }else{
						    	var sqlQCheckSelated = 'SELECT option_id from new_flow_questions_answers_log where user_id = ? AND question_id = ? ORDER BY ID DESC LIMIT 1'
								var whereCond = [userData.id,singleQues.id];
								connection.query(sqlQCheckSelated,whereCond, (errInner, resPonse) => {
									if(resPonse.length > 0){
										for (var i = 0; i < resInnner.length; i++) {
											if(resPonse[0].option_id == resInnner[i].id){
												resInnner[i].is_selected = 'yes';
											}else{
												resInnner[i].is_selected = 'no';
											}
										}
										singleQues.options_array = resInnner;
								    	cat_arr.push(singleQues);
								    	callbackInner(null);		
									}else{
										singleQues.options_array = resInnner;
								    	cat_arr.push(singleQues);
								    	callbackInner(null);		
									}
								    
								});
						    }
						});
					}, function(err) {
					    if( err ) {
					    	callback(null,[])
					    } else {
					    	callback(null,cat_arr)
					    }
					});
				}else{
					callback(null,[])
				}
			}],
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Questions loaded successfully.";
		    	screenData.questions = d.get_question_data;
		    	result(null, screenData);
		    } 
		});
	},
	get_ladder_screen : async function(bodyData,userData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT nafsc.title, nafm.image_name media , nafsc.media_type FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'ladder_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	app_drawer_permission : async function(bodyData,userData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT nafsc.title,nafsc.subtitle, nafm.image_name media, nafsc.media_type FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'app_drawer_permission'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	push_notification_screen : async function(bodyData,userData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT nafsc.title,nafsc.subtitle, nafm.image_name media,nafsc.media_type FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'push_notification_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	storage_permission_screen : async function(bodyData,userData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT nafsc.title,nafsc.subtitle, nafm.image_name media FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'storage_permission_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	camera_permission_screen : async function(bodyData,userData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT nafsc.title,nafsc.subtitle, nafm.image_name media,nafsc.media_type FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'camera_permission_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	gallery_permission_screen : async function(bodyData,userData,result){
		var dimension = getDimension(bodyData.dimension);
		asyncModule.auto({
		    get_screen: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT nafsc.title,nafsc.subtitle, nafm.image_name media,nafsc.media_type FROM new_app_flow_screen_content nafsc 
		    					INNER JOIN new_app_flow_media nafm ON nafm.app_flow_id = nafsc.id 
		    					WHERE nafm.dimension = '`+dimension+`' AND nafm.screen_name = 'gallery_permission_screen'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/app_screen_images/';
		    	screenData.data = (d.get_screen.length > 0 ) ? d.get_screen[0] : {};
		    	result(null, screenData);
		    } 
		});
	},
	save_question_option : async function(bodyData,userData,result){
		asyncModule.auto({
		    save_data: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `INSERT INTO new_flow_questions_answers_log (user_id, question_id, option_id) 
		    	VALUES ("`+userData.id+`", "`+bodyData.question_id+`", "`+bodyData.option_id+`");`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Option saved successfully.";
		    	result(null, screenData);
		    } 
		});
	},
	save_question_option_by_cat : async function(bodyData,userData,result){
		asyncModule.auto({
		    save_data: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `INSERT INTO new_flow_by_category_que_ans_log (user_id, question_id, option_id, category_id) 
		    	VALUES ("`+userData.id+`", "`+bodyData.question_id+`", "`+bodyData.option_id+`", "`+bodyData.category_id+`");`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Option saved successfully.";
		    	result(null, screenData);
		    } 
		});
	},
	complete_setup_category : function(bodyData,userData,result){
		asyncModule.auto({
		    get_parent_cat: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var sqlQuery = `SELECT id,title,rounded_image FROM parent_category WHERE status = '1'`;
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
			get_child_cat:['get_parent_cat',function(results,callback){
				if(results.get_parent_cat.length > 0){
					var cat_arr = [];
					asyncModule.each(results.get_parent_cat, function(singleCat, callbackInner) {
						var sqlQuerySubCat = `SELECT category.id,category.title,rounded_image,category_status,IF(new_flow_questions.id IS NULL,'no','yes') have_questions FROM category left join new_flow_questions on new_flow_questions.category_id=category.id AND new_flow_questions.status = '1' WHERE category.status='1' AND is_quick_setup_cat = 'no' and parent_cat_id != '0' and parent_cat_id="`+singleCat.id+`" GROUP BY category.id`;
				    	connection.query(sqlQuerySubCat, (errInner, resInnner) => {
						    if (errInner) {
						      	callbackInner(errInner);
						    }else{
						    	singleCat.goals_array = resInnner;
						    	cat_arr.push(singleCat);
						    	callbackInner(null);
						    }
						});
					}, function(err) {
					    if( err ) {
					    	callback(null,[])
					    } else {
					    	callback(null,cat_arr)
					    }
					});
				}else{
					callback(null,[])
				}
			}]
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/cat_img/';
		    	screenData.subtitle = "Lorem Lorem Lorem Lorem Lorem";
		    	screenData.title = "Lorem Lorem Lorem Lorem Lorem";
		    	screenData.categories_array = d.get_child_cat;
		    	result(null, screenData);
		    } 
		});
	},
	save_quick_setup_screen : function(bodyData,userData,result){
		asyncModule.auto({
		    save_cat_to_bucket: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
		    	var cat_arr = bodyData.goals_id.split(",");
		    	asyncModule.each(cat_arr, function(singleCat, callbackInner) {
					addRemoveBulkBImg('add',userData.id,singleCat,'save_quick_setup_screen',function(customErr, customRes){
						if(customErr){
							callbackInner(customErr);
						}else{
							callbackInner();
						}
					})
				}, function(err) {
				    if( err ) {
				    	callback(null,[])
				    } else {
				    	callback(null,cat_arr)
				    }
				});
			},
			get_category_images:['save_cat_to_bucket',function(results,callback){
				var baseUrl = globalVariables.new_server_url+'uploads/posts/';
				var dimension = getDimension(bodyData.dimension);

				var cat_arr = bodyData.goals_id.split(",");
				var catIdString = cat_arr.join();
				
				var sqlQuery = `SELECT p.id, case when pi.image_name <> '' then CONCAT('', "`+baseUrl+`",
	pi.image_name) else '' end as image_name, case when p.thubnail <> '' then CONCAT('',"`+baseUrl+`", p.thubnail) else '' end as thubnail FROM (posts p) INNER JOIN post_images pi ON pi.post_id = p.id
		WHERE (pi.dimension = "`+dimension+`" AND p.team_id in("`+catIdString+`") AND p.id not in (select post_id from hidden_images where user_id="`+userData.id+`" )) ORDER BY p.id DESC`;
			
				connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{

				    	let sqlUpdateUser = `UPDATE users SET
				    	is_onboard_setup_completed = ? ,
				    	onboard_setup_complete_type = ? ,
				    	selected_category = ? ,
				    	morning_notification_time = ? ,
				    	mid_notification_time = ? ,
				    	evening_notification_time = ? 
				    	WHERE id = ?`;
				    	var morTime = bodyData.morning_notification;
				    	var midDay = bodyData.midday_notification;
				    	var eveTime = bodyData.evening_notification;
				    	let dataUpdateUser = ['true','quick',bodyData.goals_id,morTime,midDay,eveTime,userData.id];
				    	connection.query(sqlUpdateUser,dataUpdateUser);
				    	callback(null, res);
				    }
				});
			}]
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/posts/';
		    	screenData.morning_notification = bodyData.morning_notification;
		    	screenData.midday_notification = bodyData.midday_notification;
		    	screenData.evening_notification = bodyData.evening_notification;
		    	screenData.category_data = d.get_category_images;
		    	result(null, screenData);
		    } 
		});
	},
	save_complete_setup_screen : function(bodyData,userData,result){
		asyncModule.auto({
		    save_cat_to_bucket: function(callback) {
		    	module.exports.loginUserSaveTracking(bodyData,userData.id,function(er,d){
				});
				if(typeof bodyData.goals_id != 'undefined' &&
					bodyData.goals_id != '' &&
					bodyData.goals_id != null &&
					bodyData.goals_id != 'null' ){
					var cat_arr = bodyData.goals_id.split(",");
			    	asyncModule.each(cat_arr, function(singleCat, callbackInner) {
						addRemoveBulkBImg('add',userData.id,singleCat,'save_complete_setup_screen',function(customErr, customRes){
							if(customErr){
								callbackInner(customErr);
							}else{
								callbackInner();
							}
						})
					}, function(err) {
					    if( err ) {
					    	callback(null,[])
					    } else {
					    	callback(null,cat_arr)
					    }
					});	
				}else{
					callback(null,[])
				}
		    	
			},
			get_category_images:['save_cat_to_bucket',function(results,callback){
				var baseUrl = globalVariables.new_server_url+'uploads/posts/';
				var dimension = getDimension(bodyData.dimension);

				if(typeof bodyData.goals_id != 'undefined' &&
					bodyData.goals_id != '' &&
					bodyData.goals_id != null &&
					bodyData.goals_id != 'null' ){

					var cat_arr = bodyData.goals_id.split(",");
					var catIdString = cat_arr.join();
					var sqlQuery = `SELECT p.id, case when pi.image_name <> '' then CONCAT('', "`+baseUrl+`",
					pi.image_name) else '' end as image_name, case when p.thubnail <> '' then CONCAT('',"`+baseUrl+`", p.thubnail) else '' end as thubnail FROM (posts p) INNER JOIN post_images pi ON pi.post_id = p.id
					WHERE (pi.dimension = "`+dimension+`" AND p.team_id in("`+catIdString+`") AND p.id not in (select post_id from hidden_images where user_id="`+userData.id+`" )) ORDER BY p.id DESC`;

					connection.query(sqlQuery, (err, res) => {
					    if (err) {
					      	callback(err,null);
					    }else{

					    	let sqlUpdateUser = `UPDATE users SET
					    	is_onboard_setup_completed = ? ,
					    	onboard_setup_complete_type = ? , 
					    	selected_category = ? ,
					    	parent_category = ? ,
					    	morning_notification_time = ? ,
					    	mid_notification_time = ? ,
					    	evening_notification_time = ? 
					    	WHERE id = ?`;

					    	var parentCat = bodyData.parent_cat_id;
					    	var morTime = bodyData.morning_notification;
					    	var midDay = bodyData.midday_notification;
					    	var eveTime = bodyData.evening_notification;
					    	let dataUpdateUser = ['true','complete',bodyData.goals_id,parentCat,morTime,midDay,eveTime,userData.id];
					    	connection.query(sqlUpdateUser,dataUpdateUser);
					    	callback(null, res);
					    }
					});
				}else{
					let sqlUpdateUser = `UPDATE users SET
				    	is_onboard_setup_completed = ? ,
				    	onboard_setup_complete_type = ? , 
				    	parent_category = ? ,
				    	morning_notification_time = ? ,
				    	mid_notification_time = ? ,
				    	evening_notification_time = ? 
				    	WHERE id = ?`;

			    	var parentCat = bodyData.parent_cat_id;
			    	var morTime = bodyData.morning_notification;
			    	var midDay = bodyData.midday_notification;
			    	var eveTime = bodyData.evening_notification;
			    	let dataUpdateUser = ['true','complete',parentCat,morTime,midDay,eveTime,userData.id];
			    	connection.query(sqlUpdateUser,dataUpdateUser);
			    	callback(null, []);
				}
			}]
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data loaded";
		    	screenData.base_url = globalVariables.new_server_url+'uploads/posts/';
		    	screenData.morning_notification = bodyData.morning_notification;
		    	screenData.midday_notification = bodyData.midday_notification;
		    	screenData.evening_notification = bodyData.evening_notification;
		    	screenData.category_data = d.get_category_images;
		    	result(null, screenData);
		    } 
		});
	},
	isAuthenticated : function(bodyData,result){
		asyncModule.auto({
		    auth_checker: function(callback) {
		    	var sqlQuery = 'SELECT * FROM users WHERE access_token ="' + bodyData.access_token + '" AND status="1" limit 1';
		    	connection.query(sqlQuery, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	result(e, d.auth_checker);
		    } 
		});
	},
	saveScreenTrackingLog : function(bodyData,result){
		asyncModule.auto({
		    saveData: function(callback) {
		    	var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
				var currentTimeStapm = moment().unix();
				var sqlQuery = 'INSERT INTO `user_activity_tracker` (`screen_name`, `unique_device_id`,`device_type`, `timestamp_time`, `full_date`) VALUES (?, ?, ?, ?, ?);';
		    	var dataInsert = [bodyData.screen_name,bodyData.unique_device_id,bodyData.device_type,currentTimeStapm,currentTime];
		    	connection.query(sqlQuery,dataInsert, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	result(e, d.saveData);
		    } 
		});
	},
	loginUserSaveTracking : function(bodyData,userId,result){
		asyncModule.auto({
		    saveData: function(callback) {
		    	var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
				var currentTimeStapm = moment().unix();
				var sqlQuery = 'INSERT INTO `user_activity_tracker` (`user_id`, `screen_name`, `unique_device_id`, `device_type`, `timestamp_time`, `full_date`) VALUES (?, ?, ?, ?, ?, ?);';
		    	var dataInsert = [userId,bodyData.screen_name,bodyData.unique_device_id,bodyData.device_type,currentTimeStapm,currentTime];
		    	connection.query(sqlQuery,dataInsert, (err, res) => {
				    if (err) {
				      	callback(err,null);
				    }else{
				    	callback(null, res);
				    }
				});
			},
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	result(e, d.saveData);
		    } 
		});
	},
	user_screens_activity_tracker : function(bodyData,result){
		asyncModule.auto({
		    saveData: function(callback) {
		    	var currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
				var currentTimeStapm = moment().unix();
		    	var token = bodyData.access_token;
		    	if (token == undefined || token == 'undefined' || token == null || token == 'null' || token == ''){
		    		var sqlQuery = 'INSERT INTO `user_activity_tracker` (`screen_name`, `unique_device_id`,`device_type`, `timestamp_time`, `full_date`) VALUES (?, ?, ?, ?, ?);';
			    	var dataInsert = [bodyData.screen_name,bodyData.unique_device_id,bodyData.device_type,currentTimeStapm,currentTime];
			    	connection.query(sqlQuery,dataInsert, (err, res) => {
					    if (err) {
					      	callback(err,null);
					    }else{
					    	callback(null, {code:'200'});
					    }
					});
		    	}else{
		    		var sqlQuery = 'SELECT id FROM users WHERE access_token ="' + token + '" AND status="1" limit 1';
			    	connection.query(sqlQuery, (err, res) => {
					    if (err) {
					      	callback(err,null);
					    }else{
					    	if(res.length > 0){
					    		var sqlQuery = 'INSERT INTO `user_activity_tracker` (`user_id`, `screen_name`, `unique_device_id`, `device_type`, `timestamp_time`, `full_date`) VALUES (?, ?, ?, ?, ?, ?);';
						    	var dataInsert = [res[0].id,bodyData.screen_name,bodyData.unique_device_id,bodyData.device_type,currentTimeStapm,currentTime];
						    	connection.query(sqlQuery,dataInsert, (err, res) => {
								    if (err) {
								      	callback(err,null);
								    }else{
								    	callback(null, {code:'200'});
								    }
								});
					    	}else{
					    		callback(null, {code:'205'});
					    	}
					    }
					});
		    	}
		    },
		}, function(e, d) {
		    if (e){
		    	result(e, null);
		    }else{
		    	var screenData = {};
		    	screenData.result = true;
		    	screenData.code = "200";
		    	screenData.status = "Success";
		    	screenData.message = "Data saved successfully.";
		    	if(d.saveData.code == '205'){
		    		screenData.result = false;
		    		screenData.code = "201";
		    		screenData.status = "Error";
		    		screenData.message = "Wrong access token";
		    	}
		    	result(null, screenData);
			} 
		});
	},
	getUserDataByAccessToken : async function(accessToken){
		const rows = await fn('SELECT * FROM users WHERE access_token ="' + accessToken + '" limit 1');
		return rows;
	},
	addOwnResolutionImg : async function (insertData){
		var sql = "INSERT INTO own_resolution_images (user_id, resolution_id,original_name,images_arr,thumbnail) VALUES ('"+insertData.user_id+"','"+insertData.resolution_id+"','"+insertData.original_name+"','"+insertData.images_arr+"','"+insertData.thumbnail+"')";
		connection.query(sql, function (err, result) {
		    if (err) throw err;
		    return 'record added';
		});
	},
	getOwnLatestImage: async function (user_id,resolution_id,dimension){
		var sql = "SELECT *FROM (own_resolution_images) WHERE `user_id` =  '"+user_id+"' AND `resolution_id` =  '"+resolution_id+"' ORDER BY `id` desc LIMIT 1";
		const rows = await fn(sql);
		var returnData = [];
		for (var i = rows.length - 1; i >= 0; i--) {
			var unserData = PHPUnserialize.unserialize(rows[i].images_arr);
			//console.log(unserData);
			rows[i].images_arr = [];
			rows[i].images_arr = unserData;
			if(dimension == 'mdpi'){
				rows[i].image = (typeof rows[i].images_arr.mdpi != 'undefined' && rows[i].images_arr.mdpi != '') ? globalVariables.new_server_url+'uploads/my_rsolution_img'+'/'+rows[i].images_arr.mdpi : '';	
			}
			if(dimension == 'hdpi'){
				rows[i].image = (typeof rows[i].images_arr.hdpi != 'undefined' && rows[i].images_arr.hdpi != '') ? globalVariables.new_server_url+'uploads/my_rsolution_img'+'/'+rows[i].images_arr.hdpi : '';	
			}
			if(dimension == 'xhdpi'){
				rows[i].image = (typeof rows[i].images_arr.xhdpi != 'undefined' && rows[i].images_arr.xhdpi != '') ? globalVariables.new_server_url+'uploads/my_rsolution_img'+'/'+rows[i].images_arr.xhdpi : '';	
			}
			if(dimension == 'xxhdpi'){
				rows[i].image = (typeof rows[i].images_arr.xxhdpi != 'undefined' && rows[i].images_arr.xxhdpi != '') ? globalVariables.new_server_url+'uploads/my_rsolution_img'+'/'+rows[i].images_arr.xxhdpi : '';	
			}
			if(dimension == 'xxxhdpi'){
				rows[i].image = (typeof rows[i].images_arr.xxxhdpi != 'undefined' && rows[i].images_arr.xxxhdpi != '') ? globalVariables.new_server_url+'uploads/my_rsolution_img'+'/'+rows[i].images_arr.xxxhdpi : '';	
			}
			
			rows[i].thumbnail = (rows[i].thumbnail != '') ? globalVariables.new_server_url+'uploads/my_rsolution_img'+'/'+rows[i].thumbnail : '';

			returnData.push(rows[i]);
			//console.log(rows[i].images_arr);
		}
		var datareturn = Object.values(JSON.parse(JSON.stringify(returnData)));
		return datareturn;
		
	},
	getOwnResolutionImgs: async function (user_id,resolution_id,dimension){
		var sql = "SELECT * FROM (own_resolution_images) WHERE `user_id` =  '"+user_id+"' AND `resolution_id` =  '"+resolution_id+"' ORDER BY `id` desc";
		const rows = await fn(sql);
		var returnData = [];
		for (var i = rows.length - 1; i >= 0; i--) {
			var unserData = PHPUnserialize.unserialize(rows[i].images_arr);
			//console.log(unserData);
			rows[i].images_arr = [];
			rows[i].images_arr = unserData;
			rows[i].thumbnail = (rows[i].thumbnail != '') ? globalVariables.new_server_url+'uploads/my_rsolution_img'+'/'+rows[i].thumbnail : '';

			returnData.push(rows[i]);
			//console.log(rows[i].images_arr);
		}
		var datareturn = Object.values(JSON.parse(JSON.stringify(returnData)));
		return datareturn;
	},
	getSingleResolution: async function (user_id,resolution_id){
		var sql = "SELECT priming_status FROM (own_resolutions) WHERE `user_id` =  '"+user_id+"' AND `id` = '"+resolution_id+"'";
		const rows = await fn(sql);
		if(rows.length > 0 ){
			var datareturn = Object.values(JSON.parse(JSON.stringify(rows)));
			return datareturn[0];	
		}else{
			var obje = {};
			obje.priming_status = 'off';
			return obje;
		}
		
	},
	membershipChecker:async function(resultArray){
		let now = new Date();
		var currentDate  = dateConvert.format(now, 'YYYY-MM-DD HH:mm:ss');
		console.log(currentDate);
		console.log(resultArray[0].next_renew_date);
		//$currnetTimeDate = date('Y-m-d H:i:s');
		if(resultArray[0].next_renew_date != ''){
			//$userCurrentPackage = strtotime($userData['next_renew_date']);
			if(currentDate < resultArray[0].next_renew_date){
				
			}else{
				var sql = "UPDATE users SET is_premium_user = 'no' WHERE id ="+resultArray[0].id;
				const rows = await fn(sql);
			}
		}
	},
	addOwnImageUserPre : async function (insertData){
		var sql = "INSERT INTO premium_user_images (image_name,date,user_id,image_array,thubnail) VALUES ('"+insertData.image_name+"','"+insertData.date+"','"+insertData.user_id+"','"+insertData.image_array+"','"+insertData.thubnail+"')";
		const rows = await fn(sql);
		return rows.insertId;
		// connection.query(sql, function (err, result) {
		//     if (err) throw err;
		//     console.log(result.insertId);
		// });
	},
	get_premium_user_img : async function (dataInsertedId){
		var sql = "SELECT pui.*, case when pui.image_name <> '' then CONCAT('', '"+globalVariables.new_server_url+"uploads/my_uploads/', pui.image_name) else '' end as image_name FROM (`premium_user_images` pui) INNER JOIN `users` u ON `u`.`id` = `pui`.`user_id` WHERE `pui`.`id` ="+dataInsertedId;
		const rows = await fn(sql);
		return rows;
	},
	updateUserDataSubscrip:async function(dataUpdate){
		var sql = "UPDATE users SET subscription_images = '"+dataUpdate.subscription_images+"' WHERE id ="+dataUpdate.user_id;
		const rows = await fn(sql);
		return rows;	
	},
	checkPrimesPackagePurchased:async function(user_id,productId){
		var sql = "select count(id) as package_purchase_count FROM (premium_users) WHERE `user_id` =  '"+user_id+"' AND `order_id` = '"+productId+"'";
		const rows = await fn(sql);
		return rows;
	},
	getPrimesAddedWithPackage: async function(user_id,productId){
		var sql = "select count(id) as primes_added_count FROM (purchased_package_data) WHERE `user_id` =  '"+user_id+"' AND `package_id` = '"+productId+"'";
		const rows = await fn(sql);
		return rows;
	},
	purchasePrimeData:async function (userID,packageId,post_id_arr,category_id){
		var sql = "INSERT INTO purchased_package_data (user_id,package_id,category_id,post_id) VALUES ('"+userID+"','"+packageId+"','"+category_id+"','"+post_id_arr+"')";
		const rows = await fn(sql);
		return rows.insertId;
	},
	wakeCallMysql:async function(){
		var sql = "select id from users limit 1";
		const rows = await fn(sql);
	}
	
	
};
function addRemoveBulkBImg(action,user_id,category_id,api,callback){
	var currentTimeAndDate = moment().format('YYYY-MM-DD HH:mm:ss');
	var currentDateMonth = moment().format('YYYY-MM-DD');
	if(action == 'add'){
		var sqlQuery = `INSERT INTO goals_add_delete_history (goal_id, user_id, long_date, short_date, action, is_empty_bucket_action, api_name) VALUES ("`+category_id+`", "`+user_id+`", "`+currentTimeAndDate+`", "`+currentDateMonth+`", 'add', 'no', "`+api+`")`;
		connection.query(sqlQuery, (err, res) => {
		});
		var getCatPostQuery = `	SELECT p.id, team_id
								FROM (posts p)
								INNER JOIN post_images pi ON pi.post_id = p.id
								WHERE (p.team_id = "`+category_id+`" and p.id not in (select post_id from bucket_images where user_id = "`+user_id+`"))
								GROUP BY p.id
								ORDER BY p.id DESC`;

		var insertToBucArr = [];
		var postIDArr = [];
		connection.query(getCatPostQuery, (err, res) => {
			if(res.length > 0){
				asyncModule.each(res, function(singlePost, callbackInner) {
					var currentTimeStapm = moment().unix();
					var singleBuceketImg =  [singlePost.id,user_id,singlePost.team_id,currentTimeStapm];
					insertToBucArr.push(singleBuceketImg);
					postIDArr.push(singlePost.id);
					callbackInner(null);
				}, function(err) {
					var sql = "INSERT INTO bucket_images (post_id, user_id, category_id, added_date) VALUES ?";
					var postIDString = postIDArr.join();
					connection.query(sql, [insertToBucArr], function(err) {
					    if (err){
					    	callback(err);
					    }else{
					    	var deleteSql = `DELETE FROM deleted_bucket_images WHERE user_id="`+user_id+`" and post_id in ("`+postIDString+`")`;
					    	connection.query(deleteSql, function(err) {
							    if (err){
							    	callback(err);
							    }else{
							    	callback(null);
							    }
							});
					    }
					});
				});
			}else{
				callback(null);
			}
		});
	}
}