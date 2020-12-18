var express = require('express');
var router = express.Router();
var multer  = require('multer');
var sharp  = require('sharp');
var php = require('js-php-serialize');
var env = require('../env');
var globalVariables = require('../global_variables')[env.instance];
var db = require('../configs/dbCredentials')[env.instance]
var usersModel = require('../models/usersModel');
var PHPUnserialize = require('php-unserialize');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, globalVariables.own_resolution_upload_path)
  },
  filename: function (req, file, cb) {
  	cb(null, file.fieldname + '-' + Date.now()+req.body.access_token+'.jpeg')
  }
})

var storageOwn = multer.diskStorage({
  destination: function (req, file, cb) {
  	cb(null, globalVariables.own_image_upload)
  },
  filename: function (req, file, cb) {
  	cb(null, file.fieldname + '-' + Date.now()+req.body.access_token+'.jpeg')
  }
})

var fileFilter =  async function (req, file, cb) {
		var response = await validationCustom(req,file,'post_file');
		//console.log(response);
		if(response.result == false){
			cb(null, false);	
		}else{
			cb(null, true);
		}
}

var fileFilterOwnImage =  async function (req, file, cb) {
		var response = await validationCustomOwnImage(req,file,'post_file');
		//console.log(response);
		if(response.result == false){
			cb(null, false);	
		}else{
			cb(null, true);
		}
}

var fileFilterOwnImageUploadSecond =  async function (req, file, cb) {
		var response = await uploadMyImage(req,file,'post_file');
		//console.log(response);
		if(response.result == false){
			cb(null, false);	
		}else{
			cb(null, true);
		}
}

var upload = multer({ storage: storage,fileFilter:fileFilter})

var uploadOwnImage = multer({ storage: storageOwn,fileFilter:fileFilterOwnImage})

var uploadOwnImageSecond = multer({ storage: storageOwn,fileFilter:fileFilterOwnImageUploadSecond})

/* GET users listing. */
router.post('/', function(req, res, next) {
  	var object = {};
	object.result = false;
	object.code = 201;
	object.status = 'Error';
	object.message = "Please select api";
	res.send(object);
});

router.post('/own_goal_add_image', upload.single('own_goal_image'),async function(req, res, next) {
	var response = await validationCustom(req,req.file,'');
	res.send(response);
});

router.post('/add_image_premium', uploadOwnImage.single('my_upload'),async function(req, res, next) {
	var response = await validationCustomOwnImage(req,req.file,'');
	res.send(response);
});

router.post('/upload_my_image', uploadOwnImageSecond.single('my_upload'),async function(req, res, next) {
	var response = await uploadMyImage(req,req.file,'');
	res.send(response);
});

router.get('/image_test',async function(req, res) {
	
	// /var/www/html/api.happego.app/hapego/uploads/my_rsolution_img
	const sourceFolder = '/var/www/html/api.happego.app/hapego/uploads/my_rsolution_img_cron_test/';
	const destFolder   = '/var/www/html/api.happego.app/hapego/uploads/my_rsolution_img/';
	const fs = require('fs');

	fs.readdir(sourceFolder, (err, files) => {
	  	files.forEach(file => {
		    var access_token = "9f1894adfe64da55d90f39af61efeec4";
		    fs.copyFile(sourceFolder+file, destFolder+file, (err) => {
			  	if (err) throw err;
			  	var insertObject = {};
				insertObject.user_id = '9348';
				insertObject.original_name = file;
				insertObject.resolution_id = '954';
				insertObject.thumbnail  	 			= '360-640'+file;

				var source = sourceFolder+file;
				resizeImgCustom(source, destFolder+'360-640'+file ,360,640);
				resizeImgCustom(source, destFolder+'540-960'+file ,540,960);
				resizeImgCustom(source, destFolder+'720-1280'+file ,720,1280);
				resizeImgCustom(source, destFolder+'1080-1920'+file ,1080,1920);
				resizeImgCustom(source, destFolder+'1440-2560'+file ,1440,2560);

				var imageArr = [];
				var imageTypes = {};
				imageTypes.mdpi = '360-640'+file;
				imageTypes.hdpi = '540-960'+file;
				imageTypes.xhdpi = '720-1280'+file;
				imageTypes.xxhdpi = '1080-1920'+file;
				imageTypes.xxxhdpi = '1440-2560'+file;
				imageArr.push(imageTypes);
				imageArr = php.serialize(imageArr[0]);
				insertObject.images_arr = imageArr;
				var dataInserted =  usersModel.addOwnResolutionImg(insertObject);
			});
		});
		var object = {};
		object.result = true;
		object.code = 200;
		object.message = "Resolution Image added Successfully";
		res.send(object);
	});


});

async function validationCustomOwnImage( req,file,post_file ) {
	if(typeof req.body == 'undefined'){
		var object = {};
		object.result = false;
		object.code = 201;
		object.message = "Data empty!";
		return object;
	}else{
		if(typeof req.body.access_token == 'undefined' || req.body.access_token == ''){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "access_token should not be empty";
			return object;
		}else if(typeof file == 'undefined'){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "file should not be empty/wrong access token";
			return object;	
		}else{
			var results = await usersModel.getUserDataByAccessToken(req.body.access_token);
			var resultArray = Object.values(JSON.parse(JSON.stringify(results)));
			if(post_file == 'post_file'){
				if(typeof resultArray != 'undefined' && resultArray.length > 0){
					var object = {};
					object.result = true;
					object.code = 200;
					object.message = "can upload image";
					return object;				
				}else{
					var object = {};
					object.result = false;
					object.code = 201;
					object.message = "Wrong access token";
					return object;	
				}
			}else{
				if(typeof resultArray != 'undefined' && resultArray.length > 0){
					usersModel.membershipChecker(resultArray);
					
					var results = await usersModel.getUserDataByAccessToken(req.body.access_token);
					var resultArray = Object.values(JSON.parse(JSON.stringify(results)));
					var userData = resultArray;
					var deviceTypeCheck = resultArray[0].device_type;
					
					var arr = resultArray[0].device_type.split(',');
					var st = arr[arr.length-1];

					if(resultArray[0].current_app_version > '3.1.28' || st == 'iOS'){
						if(resultArray[0].is_premium_user == 'yes'){
							var insertObject = {};
							
							insertObject.image_name = file.filename;
							insertObject.date = Date.now();
							insertObject.user_id = resultArray[0].id;
							
							var source = globalVariables.own_image_upload+file.filename;
							resizeImgCustom(source, globalVariables.own_image_upload+'240-320'+file.filename ,240,320);
							resizeImgCustom(source, globalVariables.own_image_upload+'360-640'+file.filename ,360,640);
							resizeImgCustom(source, globalVariables.own_image_upload+'540-960'+file.filename ,540,960);
							resizeImgCustom(source, globalVariables.own_image_upload+'720-1280'+file.filename ,720,1280);
							resizeImgCustom(source, globalVariables.own_image_upload+'1080-1920'+file.filename ,1080,1920);
							resizeImgCustom(source, globalVariables.own_image_upload+'1440-2560'+file.filename ,1440,2560);
							
							var imageArr = [];
							var imageTypes = {};

							imageTypes.thumb = '240-320'+file.filename ;
							imageTypes.mdpi = '360-640'+file.filename ;
							imageTypes.hdpi = '540-960'+file.filename;
							imageTypes.xhdpi = '720-1280'+file.filename;
							imageTypes.xxhdpi = '1080-1920'+file.filename;
							imageTypes.xxxhdpi = '1440-2560'+file.filename;
							
							imageArr.push(imageTypes);
							imageArr = php.serialize(imageArr[0]);
							insertObject.image_array = imageArr;
							insertObject.thubnail	= '240-320'+file.filename;

							var dataInserted = await usersModel.addOwnImageUserPre(insertObject);
							if(typeof dataInserted == 'undefined' || dataInserted == ''){
								var object = {};
								object.result = false;
								object.code = 201;
								object.message = "There are some Technical issues";
								return object;	
							}else{

								var imageArrRetu = await usersModel.get_premium_user_img(dataInserted);
								var unserializeImgs = [];
								var resultArray = Object.values(JSON.parse(JSON.stringify(imageArrRetu)));
								
								if(typeof resultArray[0].image_array != 'undefined' && resultArray[0].image_array != ''){
										unserializeImgs = PHPUnserialize.unserialize(resultArray[0].image_array);
								}
								resultArray[0].image_array = unserializeImgs;
								resultArray[0].file_path   = globalVariables.new_server_url+'uploads/my_uploads/';
								data = resultArray[0];
								
								//////////////////////// CODE FOR SUBSCRIPTION IMAGE
								var array1 = (userData[0].subscription_images != '') ?  userData[0].subscription_images.split(",") : [];
								var array2 = [resultArray[0].id];
								var array3 = arrayUnique(array1.concat(array2));
								var myVar2 = array3.join(','); 
								var updateObject = {};
								updateObject.user_id = userData[0].id;
								updateObject.subscription_images = myVar2;
								await usersModel.updateUserDataSubscrip(updateObject);
								///////////////////// END CODE

								var object = {};
								object.result = true;
								object.code = 200;
								object.message = "Image Uploaded Successfully";
								object.data	 = data;
								return object;	
							}

						}else{
							var isPrimePurchased = await usersModel.checkPrimesPackagePurchased(resultArray[0].id,'com.zoptal.happego.uploadown');
							var isPrimePurchasedArr = Object.values(JSON.parse(JSON.stringify(isPrimePurchased)));
							

							if(isPrimePurchasedArr[0].package_purchase_count == '0' || isPrimePurchasedArr[0].package_purchase_count == 0){
								var object = {};
								object.result = false;
								object.code = 201;
								object.message = "Please Purchase Product First";
								return object;
							}else{
								var packagePrimesData = await usersModel.getPrimesAddedWithPackage(resultArray[0].id,'com.zoptal.happego.uploadown');
								var packagePrimesDataArr = Object.values(JSON.parse(JSON.stringify(packagePrimesData)));
								var remain = packagePrimesDataArr[0].primes_added_count/isPrimePurchasedArr[0].package_purchase_count;
								
								if (remain == '5' || remain == 5) {
									var object = {};
									object.result = false;
									object.code = 201;
									object.message = "Please Purchase Product First";
									return object;
								}else{
									/////////////////////// IMAGE UPLOAD //////////////


									var insertObject = {};
									
									insertObject.image_name = file.filename;
									insertObject.date = Date.now();
									insertObject.user_id = resultArray[0].id;
									
									var source = globalVariables.own_image_upload+file.filename;
									resizeImgCustom(source, globalVariables.own_image_upload+'240-320'+file.filename ,240,320);
									resizeImgCustom(source, globalVariables.own_image_upload+'360-640'+file.filename ,360,640);
									resizeImgCustom(source, globalVariables.own_image_upload+'540-960'+file.filename ,540,960);
									resizeImgCustom(source, globalVariables.own_image_upload+'720-1280'+file.filename ,720,1280);
									resizeImgCustom(source, globalVariables.own_image_upload+'1080-1920'+file.filename ,1080,1920);
									resizeImgCustom(source, globalVariables.own_image_upload+'1440-2560'+file.filename ,1440,2560);
									
									var imageArr = [];
									var imageTypes = {};

									imageTypes.thumb = '240-320'+file.filename ;
									imageTypes.mdpi = '360-640'+file.filename ;
									imageTypes.hdpi = '540-960'+file.filename;
									imageTypes.xhdpi = '720-1280'+file.filename;
									imageTypes.xxhdpi = '1080-1920'+file.filename;
									imageTypes.xxxhdpi = '1440-2560'+file.filename;
									
									imageArr.push(imageTypes);
									imageArr = php.serialize(imageArr[0]);
									insertObject.image_array = imageArr;
									insertObject.thubnail	= '240-320'+file.filename;

									var dataInserted = await usersModel.addOwnImageUserPre(insertObject);
									if(typeof dataInserted == 'undefined' || dataInserted == ''){
										var object = {};
										object.result = false;
										object.code = 201;
										object.message = "There are some Technical issues";
										return object;	
									}else{

										var imageArrRetu = await usersModel.get_premium_user_img(dataInserted);
										var unserializeImgs = [];
										var resultArray = Object.values(JSON.parse(JSON.stringify(imageArrRetu)));
										
										if(typeof resultArray[0].image_array != 'undefined' && resultArray[0].image_array != ''){
												unserializeImgs = PHPUnserialize.unserialize(resultArray[0].image_array);
										}
										resultArray[0].image_array = unserializeImgs;
										resultArray[0].file_path   = globalVariables.new_server_url+'uploads/my_uploads/';
										data = resultArray[0];
										
										////// PACKAGE CODE START ///////
										await usersModel.purchasePrimeData(userData[0].id,'com.zoptal.happego.uploadown',resultArray[0].id,'');
										
										///// PACKAGE CODE END ////////
										
										var object = {};
										object.result = true;
										object.code = 200;
										object.message = "Image Uploaded Successfully";
										object.data	 = data;
										return object;	
									}

							
									/////////////////////// IMAGE UPLOAD END /////////
								}
							}
						}
						
						
					}else{
						if(resultArray[0].is_premium_user == 'yes'){
							var insertObject = {};
							
							insertObject.image_name = file.filename;
							insertObject.date = Date.now();
							insertObject.user_id = resultArray[0].id;
							
							var source = globalVariables.own_image_upload+file.filename;
							resizeImgCustom(source, globalVariables.own_image_upload+'240-320'+file.filename ,240,320);
							resizeImgCustom(source, globalVariables.own_image_upload+'360-640'+file.filename ,360,640);
							resizeImgCustom(source, globalVariables.own_image_upload+'540-960'+file.filename ,540,960);
							resizeImgCustom(source, globalVariables.own_image_upload+'720-1280'+file.filename ,720,1280);
							resizeImgCustom(source, globalVariables.own_image_upload+'1080-1920'+file.filename ,1080,1920);
							resizeImgCustom(source, globalVariables.own_image_upload+'1440-2560'+file.filename ,1440,2560);
							
							var imageArr = [];
							var imageTypes = {};

							imageTypes.thumb = '240-320'+file.filename ;
							imageTypes.mdpi = '360-640'+file.filename ;
							imageTypes.hdpi = '540-960'+file.filename;
							imageTypes.xhdpi = '720-1280'+file.filename;
							imageTypes.xxhdpi = '1080-1920'+file.filename;
							imageTypes.xxxhdpi = '1440-2560'+file.filename;
							
							imageArr.push(imageTypes);
							imageArr = php.serialize(imageArr[0]);
							insertObject.image_array = imageArr;
							insertObject.thubnail	= '240-320'+file.filename;

							var dataInserted = await usersModel.addOwnImageUserPre(insertObject);
							if(typeof dataInserted == 'undefined' || dataInserted == ''){
								var object = {};
								object.result = false;
								object.code = 201;
								object.message = "There are some Technical issues";
								return object;	
							}else{

								var imageArrRetu = await usersModel.get_premium_user_img(dataInserted);
								var unserializeImgs = [];
								var resultArray = Object.values(JSON.parse(JSON.stringify(imageArrRetu)));
								
								if(typeof resultArray[0].image_array != 'undefined' && resultArray[0].image_array != ''){
										unserializeImgs = PHPUnserialize.unserialize(resultArray[0].image_array);
								}
								resultArray[0].image_array = unserializeImgs;
								resultArray[0].file_path   = globalVariables.new_server_url+'uploads/my_uploads/';
								data = resultArray[0];
								
								//////////////////////// CODE FOR SUBSCRIPTION IMAGE
								var array1 = (userData[0].subscription_images != '') ?  userData[0].subscription_images.split(",") : [];
								var array2 = [resultArray[0].id];
								var array3 = arrayUnique(array1.concat(array2));
								var myVar2 = array3.join(','); 
								var updateObject = {};
								updateObject.user_id = userData[0].id;
								updateObject.subscription_images = myVar2;
								await usersModel.updateUserDataSubscrip(updateObject);
								///////////////////// END CODE

								var object = {};
								object.result = true;
								object.code = 200;
								object.message = "Image Uploaded Successfully";
								object.data	 = data;
								return object;	
							}

						}else{
							var object = {};
							object.result = false;
							object.code = 201;
							object.message = "Please Purchase Product First";
							return object;	
						}
					}
					
				}else{
					var object = {};
					object.result = false;
					object.code = 201;
					object.message = "Wrong access token";
					return object;	
				}
			}
		}
	}

}
async function validationCustom(req,file,post_file){
	if(typeof req.body == 'undefined'){
		var object = {};
		object.result = false;
		object.code = 201;
		object.message = "Data empty!";
		return object;
	}else{
		if(typeof req.body.access_token == 'undefined' || req.body.access_token == ''){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "access_token should not be empty";
			return object;
		}else if(typeof req.body.dimension == 'undefined' || req.body.dimension == ''){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "dimension should not be empty";
			return object;
		}else if(typeof req.body.resolution_id == 'undefined' || req.body.resolution_id == ''){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "resolution_id should not be empty";
			return object;
		}else if(typeof file == 'undefined'){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "file should not be empty/wrong access token";
			return object;	
		}else{
			var results = await usersModel.getUserDataByAccessToken(req.body.access_token);
			var resultArray = Object.values(JSON.parse(JSON.stringify(results)));
			if(post_file == 'post_file'){
				if(typeof resultArray != 'undefined' && resultArray.length > 0){
					var object = {};
					object.result = true;
					object.code = 200;
					object.message = "can upload image";
					return object;				
				}else{
					var object = {};
					object.result = false;
					object.code = 201;
					object.message = "Wrong access token";
					return object;	
				}
			}else{
				if(typeof resultArray != 'undefined' && resultArray.length > 0){
					if(resultArray[0].is_premium_user == 'yes'){
						var insertObject = {};
						
						insertObject.user_id = resultArray[0].id;
						insertObject.original_name = file.filename;
						insertObject.resolution_id = req.body.resolution_id;
						insertObject.thumbnail  	 			= '360-640'+file.filename;

						var source = globalVariables.own_resolution_upload_path+file.filename;
						resizeImgCustom(source, globalVariables.own_resolution_upload_path+'360-640'+file.filename ,360,640);
						resizeImgCustom(source, globalVariables.own_resolution_upload_path+'540-960'+file.filename ,540,960);
						resizeImgCustom(source, globalVariables.own_resolution_upload_path+'720-1280'+file.filename ,720,1280);
						resizeImgCustom(source, globalVariables.own_resolution_upload_path+'1080-1920'+file.filename ,1080,1920);
						resizeImgCustom(source, globalVariables.own_resolution_upload_path+'1440-2560'+file.filename ,1440,2560);

						var imageArr = [];
						var imageTypes = {};

						imageTypes.mdpi = '360-640'+file.filename ;
						imageTypes.hdpi = '540-960'+file.filename;
						imageTypes.xhdpi = '720-1280'+file.filename;
						imageTypes.xxhdpi = '1080-1920'+file.filename;
						imageTypes.xxxhdpi = '1440-2560'+file.filename;
						
						imageArr.push(imageTypes);
						imageArr = php.serialize(imageArr[0]);
						insertObject.images_arr = imageArr;

						var dataInserted = await usersModel.addOwnResolutionImg(insertObject);
						
						
						var object = {};
						object.result = true;
						object.code = 200;
						object.message = "Resolution Image added Successfully";

						var datareturn = await usersModel.getOwnLatestImage(resultArray[0].id,req.body.resolution_id,req.body.dimension);
						
						object.images_resolution = datareturn;
						var getCountOfImages = await usersModel.getOwnResolutionImgs(resultArray[0].id,req.body.resolution_id,req.body.dimension);
						object.can_start_priming 	 = (getCountOfImages.length) > 0 ? 'yes' : 'no';
						var priSta = await usersModel.getSingleResolution(resultArray[0].id,req.body.resolution_id);
						
						object.priming_status		 = priSta.priming_status;
						return object;
					}else{
						var object = {};
						object.result = false;
						object.code = 201;
						object.message = "Please Purchase Product First";
						return object;	
					}
				}else{
					var object = {};
					object.result = false;
					object.code = 201;
					object.message = "Wrong access token";
					return object;	
				}
			}
		}
	}
}

async function resizeImgCustom(source,destination,width,height){
	sharp(source)
	  .rotate()
	  .resize(width,height)
	  .jpeg({ quality: 75, force: false })
	  .png({ compressionLevel: 9, force: false })
	  .toFile(destination)
	  .then(data => {
	    //console.log(data);
	  })
	  .catch(err => {
	    console.log(err);
	  });
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

async function uploadMyImage( req,file,post_file ) {
	if(typeof req.body == 'undefined'){
		var object = {};
		object.result = false;
		object.code = 201;
		object.message = "Data empty!";
		return object;
	}else{
		if(typeof req.body.access_token == 'undefined' || req.body.access_token == ''){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "access_token should not be empty";
			return object;
		}else if(typeof file == 'undefined'){
			var object = {};
			object.result = false;
			object.code = 201;
			object.message = "file should not be empty/wrong access token";
			return object;	
		}else{
			var results = await usersModel.getUserDataByAccessToken(req.body.access_token);
			var resultArray = Object.values(JSON.parse(JSON.stringify(results)));
			if(post_file == 'post_file'){
				if(typeof resultArray != 'undefined' && resultArray.length > 0){
					var object = {};
					object.result = true;
					object.code = 200;
					object.message = "can upload image";
					return object;				
				}else{
					var object = {};
					object.result = false;
					object.code = 201;
					object.message = "Wrong access token";
					return object;	
				}
			}else{
				if(typeof resultArray != 'undefined' && resultArray.length > 0){
					usersModel.membershipChecker(resultArray);
					
					var results = await usersModel.getUserDataByAccessToken(req.body.access_token);
					var resultArray = Object.values(JSON.parse(JSON.stringify(results)));
					var userData = resultArray;
					var deviceTypeCheck = resultArray[0].device_type;
					
					var arr = resultArray[0].device_type.split(',');
					var st = arr[arr.length-1];

					if(resultArray[0].current_app_version > '3.1.28' || st == 'iOS'){
						if(resultArray[0].is_premium_user == 'yes'){
							var insertObject = {};
							
							insertObject.image_name = file.filename;
							insertObject.date = Date.now();
							insertObject.user_id = resultArray[0].id;
							
							var source = globalVariables.own_image_upload+file.filename;
							resizeImgCustom(source, globalVariables.own_image_upload+'240-320'+file.filename ,240,320);
							resizeImgCustom(source, globalVariables.own_image_upload+'360-640'+file.filename ,360,640);
							resizeImgCustom(source, globalVariables.own_image_upload+'540-960'+file.filename ,540,960);
							resizeImgCustom(source, globalVariables.own_image_upload+'720-1280'+file.filename ,720,1280);
							resizeImgCustom(source, globalVariables.own_image_upload+'1080-1920'+file.filename ,1080,1920);
							resizeImgCustom(source, globalVariables.own_image_upload+'1440-2560'+file.filename ,1440,2560);
							
							var imageArr = [];
							var imageTypes = {};

							imageTypes.thumb = '240-320'+file.filename ;
							imageTypes.mdpi = '360-640'+file.filename ;
							imageTypes.hdpi = '540-960'+file.filename;
							imageTypes.xhdpi = '720-1280'+file.filename;
							imageTypes.xxhdpi = '1080-1920'+file.filename;
							imageTypes.xxxhdpi = '1440-2560'+file.filename;
							
							imageArr.push(imageTypes);
							imageArr = php.serialize(imageArr[0]);
							insertObject.image_array = imageArr;
							insertObject.thubnail	= '240-320'+file.filename;

							var dataInserted = await usersModel.addOwnImageUserPre(insertObject);
							if(typeof dataInserted == 'undefined' || dataInserted == ''){
								var object = {};
								object.result = false;
								object.code = 201;
								object.message = "There are some Technical issues";
								return object;	
							}else{

								var imageArrRetu = await usersModel.get_premium_user_img(dataInserted);
								var unserializeImgs = [];
								var resultArray = Object.values(JSON.parse(JSON.stringify(imageArrRetu)));
								
								if(typeof resultArray[0].image_array != 'undefined' && resultArray[0].image_array != ''){
										unserializeImgs = PHPUnserialize.unserialize(resultArray[0].image_array);
								}
								resultArray[0].image_array = unserializeImgs;
								resultArray[0].file_path   = globalVariables.new_server_url+'uploads/my_uploads/';
								data = resultArray[0];
								
								//////////////////////// CODE FOR SUBSCRIPTION IMAGE
								var array1 = (userData[0].subscription_images != '') ?  userData[0].subscription_images.split(",") : [];
								var array2 = [resultArray[0].id];
								var array3 = arrayUnique(array1.concat(array2));
								var myVar2 = array3.join(','); 
								var updateObject = {};
								updateObject.user_id = userData[0].id;
								updateObject.subscription_images = myVar2;
								await usersModel.updateUserDataSubscrip(updateObject);
								///////////////////// END CODE

								var object = {};
								object.result = true;
								object.code = 200;
								object.message = "Image Uploaded Successfully";
								object.data	 = data;
								return object;	
							}

						}else{
							var isPrimePurchased = await usersModel.checkPrimesPackagePurchased(resultArray[0].id,'com.zoptal.happego.uploadown');
							var isPrimePurchasedArr = Object.values(JSON.parse(JSON.stringify(isPrimePurchased)));
							

							if(isPrimePurchasedArr[0].package_purchase_count == '0' || isPrimePurchasedArr[0].package_purchase_count == 0){
								var object = {};
								object.result = false;
								object.code = 201;
								object.message = "Please Purchase Product First";
								return object;
							}else{
								var packagePrimesData = await usersModel.getPrimesAddedWithPackage(resultArray[0].id,'com.zoptal.happego.uploadown');
								var packagePrimesDataArr = Object.values(JSON.parse(JSON.stringify(packagePrimesData)));
								var remain = packagePrimesDataArr[0].primes_added_count/isPrimePurchasedArr[0].package_purchase_count;
								
								if (remain == '5' || remain == 5) {
									var object = {};
									object.result = false;
									object.code = 201;
									object.message = "Please Purchase Product First";
									return object;
								}else{
									/////////////////////// IMAGE UPLOAD //////////////


									var insertObject = {};
									
									insertObject.image_name = file.filename;
									insertObject.date = Date.now();
									insertObject.user_id = resultArray[0].id;
									
									var source = globalVariables.own_image_upload+file.filename;
									resizeImgCustom(source, globalVariables.own_image_upload+'240-320'+file.filename ,240,320);
									resizeImgCustom(source, globalVariables.own_image_upload+'360-640'+file.filename ,360,640);
									resizeImgCustom(source, globalVariables.own_image_upload+'540-960'+file.filename ,540,960);
									resizeImgCustom(source, globalVariables.own_image_upload+'720-1280'+file.filename ,720,1280);
									resizeImgCustom(source, globalVariables.own_image_upload+'1080-1920'+file.filename ,1080,1920);
									resizeImgCustom(source, globalVariables.own_image_upload+'1440-2560'+file.filename ,1440,2560);
									
									var imageArr = [];
									var imageTypes = {};

									imageTypes.thumb = '240-320'+file.filename ;
									imageTypes.mdpi = '360-640'+file.filename ;
									imageTypes.hdpi = '540-960'+file.filename;
									imageTypes.xhdpi = '720-1280'+file.filename;
									imageTypes.xxhdpi = '1080-1920'+file.filename;
									imageTypes.xxxhdpi = '1440-2560'+file.filename;
									
									imageArr.push(imageTypes);
									imageArr = php.serialize(imageArr[0]);
									insertObject.image_array = imageArr;
									insertObject.thubnail	= '240-320'+file.filename;

									var dataInserted = await usersModel.addOwnImageUserPre(insertObject);
									if(typeof dataInserted == 'undefined' || dataInserted == ''){
										var object = {};
										object.result = false;
										object.code = 201;
										object.message = "There are some Technical issues";
										return object;	
									}else{

										var imageArrRetu = await usersModel.get_premium_user_img(dataInserted);
										var unserializeImgs = [];
										var resultArray = Object.values(JSON.parse(JSON.stringify(imageArrRetu)));
										
										if(typeof resultArray[0].image_array != 'undefined' && resultArray[0].image_array != ''){
												unserializeImgs = PHPUnserialize.unserialize(resultArray[0].image_array);
										}
										resultArray[0].image_array = unserializeImgs;
										resultArray[0].file_path   = globalVariables.new_server_url+'uploads/my_uploads/';
										data = resultArray[0];
										
										////// PACKAGE CODE START ///////
										await usersModel.purchasePrimeData(userData[0].id,'com.zoptal.happego.uploadown',resultArray[0].id,'');
										
										///// PACKAGE CODE END ////////
										
										var object = {};
										object.result = true;
										object.code = 200;
										object.message = "Image Uploaded Successfully";
										object.data	 = data;
										return object;	
									}

							
									/////////////////////// IMAGE UPLOAD END /////////
								}
							}
						}
						
						
					}else{
						if(resultArray[0].is_premium_user == 'yes'){
							var insertObject = {};
							
							insertObject.image_name = file.filename;
							insertObject.date = Date.now();
							insertObject.user_id = resultArray[0].id;
							
							var source = globalVariables.own_image_upload+file.filename;
							resizeImgCustom(source, globalVariables.own_image_upload+'240-320'+file.filename ,240,320);
							resizeImgCustom(source, globalVariables.own_image_upload+'360-640'+file.filename ,360,640);
							resizeImgCustom(source, globalVariables.own_image_upload+'540-960'+file.filename ,540,960);
							resizeImgCustom(source, globalVariables.own_image_upload+'720-1280'+file.filename ,720,1280);
							resizeImgCustom(source, globalVariables.own_image_upload+'1080-1920'+file.filename ,1080,1920);
							resizeImgCustom(source, globalVariables.own_image_upload+'1440-2560'+file.filename ,1440,2560);
							
							var imageArr = [];
							var imageTypes = {};

							imageTypes.thumb = '240-320'+file.filename ;
							imageTypes.mdpi = '360-640'+file.filename ;
							imageTypes.hdpi = '540-960'+file.filename;
							imageTypes.xhdpi = '720-1280'+file.filename;
							imageTypes.xxhdpi = '1080-1920'+file.filename;
							imageTypes.xxxhdpi = '1440-2560'+file.filename;
							
							imageArr.push(imageTypes);
							imageArr = php.serialize(imageArr[0]);
							insertObject.image_array = imageArr;
							insertObject.thubnail	= '240-320'+file.filename;

							var dataInserted = await usersModel.addOwnImageUserPre(insertObject);
							if(typeof dataInserted == 'undefined' || dataInserted == ''){
								var object = {};
								object.result = false;
								object.code = 201;
								object.message = "There are some Technical issues";
								return object;	
							}else{

								var imageArrRetu = await usersModel.get_premium_user_img(dataInserted);
								var unserializeImgs = [];
								var resultArray = Object.values(JSON.parse(JSON.stringify(imageArrRetu)));
								
								if(typeof resultArray[0].image_array != 'undefined' && resultArray[0].image_array != ''){
										unserializeImgs = PHPUnserialize.unserialize(resultArray[0].image_array);
								}
								resultArray[0].image_array = unserializeImgs;
								resultArray[0].file_path   = globalVariables.new_server_url+'uploads/my_uploads/';
								data = resultArray[0];
								
								//////////////////////// CODE FOR SUBSCRIPTION IMAGE
								var array1 = (userData[0].subscription_images != '') ?  userData[0].subscription_images.split(",") : [];
								var array2 = [resultArray[0].id];
								var array3 = arrayUnique(array1.concat(array2));
								var myVar2 = array3.join(','); 
								var updateObject = {};
								updateObject.user_id = userData[0].id;
								updateObject.subscription_images = myVar2;
								await usersModel.updateUserDataSubscrip(updateObject);
								///////////////////// END CODE

								var object = {};
								object.result = true;
								object.code = 200;
								object.message = "Image Uploaded Successfully";
								object.data	 = data;
								return object;	
							}

						}else{
							var object = {};
							object.result = false;
							object.code = 201;
							object.message = "Please Purchase Product First";
							return object;	
						}
					}
					
				}else{
					var object = {};
					object.result = false;
					object.code = 201;
					object.message = "Wrong access token";
					return object;	
				}
			}
		}
	}

}


module.exports = router;
