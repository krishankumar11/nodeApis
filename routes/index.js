var express = require('express');
var router = express.Router();
const sharp = require('sharp');
/* GET home page. */
router.post('/', function(req, res, next) {
	var object = {};
	object.result = false;
	object.code = 201;
	object.status = 'Error';
	object.message = "Please select api";
	res.send(object);	 
});
module.exports = router;
