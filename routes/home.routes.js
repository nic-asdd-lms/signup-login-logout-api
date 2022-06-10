var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');

// var ExpressCassandra = require('express-cassandra');

// var models = ExpressCassandra.createClient({
//     clientOptions: {
//         contactPoints: ['127.0.0.1'],
//         localDataCenter: 'datacenter1',
//         protocolOptions: { port: 9042 },
//         keyspace: 'user',
//         queryOptions: {consistency: ExpressCassandra.consistencies.one},
//         socketOptions: { readTimeout: 60000 },
//     },
//     ormOptions: {
//         defaultReplicationStrategy : {
//             class: 'SimpleStrategy',
//             replication_factor: 1
//         },
//         migration: 'safe',
//     }
// });

// var userModel = models.loadSchema('user_accounts', {
//     fields:{
//         username : "text",
//         firstname : "text",
//         lastname : "text",
//         password : "text"
//     },
//     key:["username"]
// });

router.post('/', UserController.login);
router.get('/', UserController.home);


module.exports = router;