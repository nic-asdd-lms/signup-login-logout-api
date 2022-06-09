const express=require('express');
const path = __dirname + '/views/';

const app=express();

const bodyparser=require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path));


app.get('/',function(req,res){
    res.sendFile(path + "index.html");
    // res.status(200).send(`Welcome to login , sign-up api`);
});

app.use('/api/register/', require('./routes/register.routes'));
app.use('/api/login/', require('./routes/login.routes'));



const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`app is live at ${PORT}`)
    
});
