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

  for (let i = 0; i < length; i++) {
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

// Global Data structure for storage
const urlDatabase = {
  'b2xVn2': {longUrl: 'http://www.lighthouselabs.ca', userId: 'aJ48lW'},
  '9sm5xK': {longUrl: 'http://www.google.com', userId: 'aJ48lW'},
};

const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'random@hotmail.com',
    password: 'password',
  },
};

const userIdCookie = 'user_id';

// Helper functions
/**
 * Checks if the email is already in the database or not
 * @param {string} email
 * @returns {boolean} true if email is in the database. false otherwise
 */
const isRegisteredEmail = (email) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return true;
    }
  }
  return false;
};

/**
 * Gets the user object given the user ID
 * @param {string} userId The code for the specific user. The code is generated with our random string function
 * @returns {object} user object. undefined if not found
 */
const getUser = (userId) => {
  return users[userId];
};

/**
 * Finds the user object in the "users" database given the email
 * @param {string} email email registerd with the user to find
 * @returns {object} the user object. null if not found.
 */
const getUserByEmail = (email) => {
  for (const userId in users) {
    if (users[userId].email === email) {
      return users[userId];
    }
  }
  return null;
};

// Endpoints
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
  const templateVars = {
    urls: urlDatabase,
    user: getUser(req.cookies[userIdCookie]),
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortUrl = generateRandomString(6);
  urlDatabase[shortUrl] = req.body.longUrl;
  
  res.redirect(`/urls/${shortUrl}`);
});

// === /urls/new ====
app.get('/urls/new', (req, res) => {
  const user = getUser(req.cookies[userIdCookie]);
  if (user) {
    const templateVars = {
      user: user,
    };
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
});

// === /urls/:shortUrl ===
app.get('/urls/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const user = getUser(req.cookies[userIdCookie]);
  if (user) {
    let templateVars = {
      shortUrl: shortUrl,
      longUrl: urlDatabase[shortUrl].longUrl,
      user: user,
    };
    res.render('urls_show', templateVars);
  } else {
    res.redirect('/login');
  }

});

app.post('/urls/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  urlDatabase[shortUrl].longUrl = req.body.longUrl;
  const templateVars = {
    urls: urlDatabase,
    user: getUser(req.cookies[userIdCookie]),
  };
  res.render('urls_index', templateVars);
});

// === /u/:shortUrl ===
app.get('/u/:shortUrl', (req, res) => {
  const longUrl = urlDatabase[req.params.shortUrl].longUrl;
  res.redirect(longUrl);
});


// ===== /urls/:shortUrl/delete =====
app.post('/urls/:shortUrl/delete', (req, res) => {
  const shortUrl = req.params.shortUrl;
  delete urlDatabase[shortUrl];
  const templateVars = {
    urls: urlDatabase,
    user: getUser(req.cookies[userIdCookie]),
  };
  res.render('urls_index', templateVars);
});

// ==== /login ====
app.get('/login', (req, res) => {
  const templateVars = {
    user: getUserByEmail(req.cookies[userIdCookie]),
  }
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  const reqEmail = req.body.email;
  const reqPw = req.body.password;

  const user = getUserByEmail(reqEmail);
  if (user && user.password === reqPw) {
    res
      .cookie(userIdCookie, user.id)
      .redirect('/urls');
  } else {
    res.status(403).send('Invalid login');
  }
});

// ==== /logout ====
app.post('/logout', (req, res) => {
  res
    .clearCookie(userIdCookie)
    .redirect('/urls');
});

// ==== /register =====
app.get('/register', (req, res) => {
  const templateVars = {
    user: getUser(req.cookies[userIdCookie]),
  };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  const reqEmail = req.body.email;
  const reqPw = req.body.password;

  if (reqEmail === '' || reqPw === '') {
    res.sendStatus(400);
  } else if (isRegisteredEmail(reqEmail)) {
    res.status(400).send('Email registered');
  } else {
    const user = {
      id: generateRandomString(6),
      email: reqEmail,
      password: reqPw,
    };
    users[user.id] = user;
    res
      .cookie(userIdCookie, user.id)
      .redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}`);
});
