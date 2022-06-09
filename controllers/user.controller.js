var UserService = require('../services/user.services')    


exports.createUser = async function ( req, res, next) {
    var user = await UserService.createUser(req, res)
    return res.status(200).json({
        message: "User registered",
        username: req.body.username
    });
        
}

exports.login = async function ( req, res, next) {
    var user = await UserService.login(req, res)
    
}
