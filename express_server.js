/**
 * Dec 9, 2019
 * Frederick Lee
 * 
 * https://web.compass.lighthouselabs.ca/days/w03d1/activities/169
 */

/**
 * Generate a random string of 6 character. Valid characters are digits and upper and lower case letters
 * @returns {string} random string of six characters
 */
const generateRandomString = (length) => {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = characters.length;
  let res = '';

  for (let i = 0; i < length; i++ ) {
    res += characters.charAt(Math.floor(Math.random() * charLength));
  }
  
  return res;
};

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

// === /urls ===
app.get('/urls', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortUrl = generateRandomString(6);
  urlDatabase[shortUrl] = req.body.longUrl;
  
  res.redirect(`/urls/${shortUrl}`);
})

// === /urls/new ====
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// === /urls/:shortUrl ===
app.get('/urls/:shortUrl', (req, res) => {
  let templateVars = {
    shortUrl: req.params.shortUrl,
    longUrl: urlDatabase[req.params.shortUrl],
  };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  urlDatabase[shortUrl] = req.body.longUrl;
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

// === /u/:shortUrl ===
app.get('/u/:shortUrl', (req, res) => {
  const longUrl = urlDatabase[req.params.shortUrl];
  res.redirect(longUrl);
});


// ===== /urls/:shortUrl/delete =====
app.post('/urls/:shortUrl/delete', (req, res) => {
  const shortUrl = req.params.shortUrl;
  delete urlDatabase[shortUrl];
  const templateVars = {urls: urlDatabase};
  res.render('urls_index', templateVars);
});

// ==== /login ====
app.post('/login', (req, res) => {
  const templateVars = {urls: urlDatabase};
  res
    .cookie('username', req.body.login)
    .render('urls_index', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}`);
});
