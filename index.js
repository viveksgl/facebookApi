
 
const express = require('express');
const adsSdk = require('facebook-nodejs-ads-sdk');
const app = express();
 
var fbRoute = require('./routes/fbRoute')

app.use('/fbRoute', fbRoute) 

 
 


 
 
// app.get('/account',(req, res, next) => {
//     // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
//     account
//   .read([AdAccount.Fields.name, AdAccount.Fields.age])
//   .then((account) => {
//    res.status(200).send(account) 
//   })
//   .catch(errorFunction(test1));
//      next();
// });
// app.get('/things', function(req, res){
//     res.send('Things');
//  });
// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});