/**
 * Dec 9, 2019
 * Frederick Lee
 * 
 * https://web.compass.lighthouselabs.ca/days/w03d1/activities/169
 */

 const express = require('express');
 const app = express();
 const PORT = 8080; // default port 8080

 const urlDatabase = {
   'b2xVn2': 'http://www.lighthouselabs.ca',
   '9sm5xK': 'http://www.google.com',
 };

 app.get('/', (req, res) => {
   res.send('Hello!');
 });

 app.listen(PORT, () => {
   console.log(`Example app listening to port ${PORT}`);
 });
