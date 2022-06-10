const express=require('express');
const path = __dirname + '/views/';

const cookieParser=require('cookie-parser');
const session = require('express-session');

const app=express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path));
app.use(cookieParser());

app.use(session({ 
	secret: 'hliuahflaiwncoqiqwoirhqwiuehqwieuqwoirjwqoeihfjnkejnkjgiugiweugqiwuerhnasf',
		cookie:{
			maxAge: 24 * 60 * 60 * 1000
		},
		resave: false,
		saveUninitialized: true
}));

function checkSession(req, res, next ){
	if(req.session){
		next();     //If session exists, proceed to page
	} else {
		var err = new Error("Not logged in!");
		console.log(req.session.sessionID);
		// next(err);  //Error, trying to access unauthorized page!
		res.status(400).json({
			title: "unauthorized page", 
			message: "You are unauthorized to open this page"});
	}
};



app.get('/',function(req,res){
    res.sendFile(path + "index.html");
    // res.status(200).send(`Welcome to login , sign-up api`);
});

app.set('views', __dirname + '/views')

app.use('/api/register/', require('./routes/register.routes'));
app.use('/api/home/',  require('./routes/home.routes'));
app.use('/api/profile/', checkSession, require('./routes/profile.routes'));
app.use('/api/logout/', checkSession, require('./routes/logout.routes'));


const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`)
    
});
