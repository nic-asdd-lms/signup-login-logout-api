const express=require('express');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const session = require('express-session');

const app=express();

// app use
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());

app.use(session({ 
	secret: 'hliuahflaiwncoqiqwoirhqwiuehqwieuqwoirjwqoeihfjnkejnkjgiugiweugqiwuerhnasfsdjfasfsfwewshfgyjfyuiyuouoyiuyfthdfgdsvsaweqweiuypiuhqpwhhdfghdfghdfgrnci',
		cookie:{
			maxAge: 24 * 60 * 60 * 1000
		},
		resave: false,
		saveUninitialized: true
}));

// database connection
let cassandra = require('cassandra-driver');
let authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');

client = new cassandra.Client({contactPoints: ['127.0.0.1:9042'], authProvider: authProvider,  localDataCenter: 'datacenter1', keyspace:'user'});


function checkSignIn(req, res, next ){
    if(req.session.sessionID){
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.sessionID);
        //next(err);  //Error, trying to access unauthorized page!
        res.status(400).json({title: "unauthorized page", message: "You are unauthorized to open this page"});
    }
};


app.get('/',function(req,res){
    res.status(200).send(`Welcome to login , sign-up api`);
});

// listening port
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`);
});



// sign-up 
app.post('/api/register',async(req,res) => {
   
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    if(password != password2)
        return res.status(400).json({message: "passwords do not match"});

    const query = 'SELECT * FROM user_accounts where username =?;';
    client.execute(query, [username],function(err, result) {
        //console.log("Row count is " + result.rows.length);
        if(result.rows.length > 0) {
            // console.log("Username already exist");
            return res.status(400).json({
                username : result.rows[0].username, 
            message :"user already exist"});
        }
        else 
        {
            const insertquery= 'INSERT INTO user_accounts(username, password, firstname, lastname) VALUES (?,?,?,?)';
            client.execute(insertquery, [username, password, firstname, lastname], function(err, result) {
                if(err != null)
                {
                    console.log("ERROR: "+ err);
                    return res.status(400).json({
                        message: "error"
                    })
                }    
                // console.log("User registered: "+ username);
                return res.status(200).json({
                    username : username,
                    firstname: firstname,
                    lastname: lastname, 
                    message :"user registered"})
                });

        }

            if (err != null) {
                console.log("ERROR: "+err);
            }

    });
    
});


 // login user
 var usersession;

app.post('/api/login', function(req,res){
    usersession = req.session;
    const username = req.body.username;
    const password = req.body.password;
    const sessionID = username;

    const selectquery = 'SELECT * FROM user_accounts where username =?;';
    client.execute(selectquery, [username], function(err, result) {
        
        if(result.rows.length == 0) {
            // console.log("User does not exist: "+ username);
            return res.status(400).json({
                message :"Unauthorized access"});

        }

            
        else if(result.rows[0].password === password) 
        {
            // console.log("User logged in: "+ username);
            req.session.sessionID = username;
            console.log(res.cookie.value);
            //res.status(200).send("Welcome, "+ result.rows[0].firstname + " "+ result.rows[0].lastname );
            return res.status(200).json({
                message :"Logged In",
                username : result.rows[0].username, 
                firstname: result.rows[0].firstname ,
                lastname: result.rows[0].lastname ,
                sessionID: req.session.sessionID
            });
           
        }    
        else {
            // console.log("Incorrect password");
            return res.status(400).json({
                message :"Incorrect password"});

        }
            
    });

});

// get logged in user

app.get('/api/profile',checkSignIn, function(req,res){

    usersession = req.session;
    console.log(req.session);   
    res.json({
        sessionID: req.session.sessionID
    })
});

//logout user
app.get('/api/logout',checkSignIn,function(req,res){
    const user = req.session.sessionID;
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            return res.status(400).json ({
                message: "error"
            });
        } else{
            res.status(200).json({
                message: "Logged out",
                username: user
            });
        }
    });

}); 