var UserService = require('../services/user.services')    


exports.createUser = async function ( req, res, next) {
    var user = await UserService.createUser(req, res)
    return res.status(200).json({
        message: "User registered",
        username: user.username
    });
        
}

exports.login = async function ( req, res, next) {
    var user = await UserService.login(req, res)
    
}
exports.home = async function ( req, res, next) {
    var user = await UserService.home(req, res)

}

exports.profile = async function ( req, res, next) {
    var user = await UserService.profile(req, res)
}

exports.logout = async function ( req, res, next) {
    var user = await UserService.logout(req, res)
}
