var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');


router.get('/', UserController.logout);



module.exports = router;