var ExpressCassandra = require('express-cassandra');

const models = ExpressCassandra.createClient({
    clientOptions: {
        contactPoints: ['127.0.0.1'],
        localDataCenter: 'datacenter1',
        protocolOptions: { port: 9042 },
        keyspace: 'user',
        queryOptions: {consistency: ExpressCassandra.consistencies.one},
        socketOptions: { readTimeout: 60000 },
    },
    ormOptions: {
        defaultReplicationStrategy : {
            class: 'SimpleStrategy',
            replication_factor: 1
        },
        migration: 'safe',
    }
});

const userModel = models.loadSchema('user_accounts', {
    fields:{
        username    : "text",
        firstname : "text",
        lastname     : "text",
        password : "text"
    },
    key:["username"]
});


exports.createUser = async function(req, res) {
    const password = req.body.password;
    const password2 = req.body.password2;
    
    if(password != password2)
        return res.status(400).json({message: "passwords do not match"});

        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
    
            var newuser = new models.instance.user_accounts({
                lastname: lastname,
                firstname: firstname,
            username: username,
            password: password
        });
    
        newuser.save(function(err){
            if(err) {
                console.log(err);
                return;
            }
            console.log('User registered!');
            
        });
        return newuser;   
    
}

exports.login = async function(req, res) {
    usersession = req.session;
    const username = req.body.username;
    const password = req.body.password;
    const sessionID = username;

    if(username =="")
        return res.status(400).json({
            message: "Username is mandatory"
        })

    models.instance.user_accounts.findOne({username: username}, function(err, result){
        if(err) {
            console.log("ERROR: ",err);
            return;
        }
       
        if(result == null)
            return res.status(400).json({
                message: "User does not exist"
            });

        if(password != result.password)
            return res.status(400).json({
                message: 'Incorrect password'
            });

        
        return res.status(200).json({
            message: 'Welcome, ' + result.firstname + ' ' + result.lastname

    });
    
    
});
}