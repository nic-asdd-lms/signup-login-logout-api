var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');
// var models = usermodels.models;


router.post('/', UserController.createUser);



module.exports = router;
