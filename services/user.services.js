var ExpressCassandra = require('express-cassandra');
const session = require('express-session');
const { cookie } = require('express/lib/response');
const dockerIpTools = require("docker-ip-get");

const models = ExpressCassandra.createClient({
    clientOptions: {
        contactPoints: [process.env.CASSANDRA_HOST],
        localDataCenter: 'datacenter1',
        protocolOptions: { port: process.env.CASSANDRA_LOCAL_PORT },
        keyspace: process.env.CASSANDRA_KEYSPACE,
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

        if(req.session.username && req.session.username === req.body.username){
            res.send(`Session already exist`)
        } else if(req.session.username && req.session.username != req.body.username){
            res.send(`Another user is logged in`)
        }
        else {
            var result=models.instance.user_accounts.findOne({username: username}, function(err, result){
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
        
                    
                    req.session.sessionID = result.username;
                    req.session.name= result.firstname+" "+ result.lastname;
                    req.session.username = result.username;
        
                    return res.send(`Welcome, ` + result.firstname+ ` `+ result.lastname +`<br /> <a href=\'/api/logout'>Logout</a>  <a href=\'/api/profile'>Profile</a>`)
                   
        });
            }
}


exports.home = async function(req, res) {
    if(req.session)
    return res.send(`Welcome, ` + req.session.name+`<br /> <a href=\'/api/logout'>Logout</a>  <a href=\'/api/profile'>Profile</a>`)
}

exports.profile = async function(req, res) {
    usersession = req.session;
    usersession.userid=req.body.username;
    return res.send(`Name : `+req.session.name+ `<br />  Username : `+req.session.username+ `<br /> <a href=\'/api/home'>Home</a>  <a href=\'/api/logout'>Logout</a>`)
}

exports.logout = async function(req, res) {
    req.session.destroy();
    res.redirect('/');
}