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
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// Global Data structure for storage
const urlDatabase = {
  'b2xVn2': {longUrl: 'http://www.lighthouselabs.ca', userId: 'userRandomID'},
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
const saltRounds = 10;

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

/**
 * Returns an object of all the URLs in urlDatabase that belong to user
 * @param {obj} urlDatabase database of our urls. Short url is key for {long url, user id}
 * @param {obj} user user object {id, email, password}
 * @returns {obj}
 */
const urlsForUser = (id) => {
  const userUrls = {};
  for (const shortUrlKey in urlDatabase) {
    if (urlDatabase[shortUrlKey].userId === id) {
      userUrls[shortUrlKey] = urlDatabase[shortUrlKey];
    }
  }
  return userUrls;
};

/**
 * Checks if the shortUrl belongs to the user
 * @param {string} shortUrl key of urlDatabase
 * @param {object} user user object
 * @returns {boolean} true if the url's user id is user.id. false otherwise
 */
const isUserUrl = (shortUrl, user) => {
  if (urlDatabase[shortUrl].userId === user.id) {
    return true;
  }
  return false;
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
  let userUrls = {};
  const user = getUser(req.cookies[userIdCookie]);

  if (user) {
    userUrls = urlsForUser(user.id);
  }

  const templateVars = {
    urls: userUrls,
    user: user,
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortUrl = generateRandomString(6);
  const user = getUser(req.cookies[userIdCookie]);
  urlDatabase[shortUrl] = {
    longUrl: req.body.longUrl,
    userId: user.id,
  };

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
    // need to check this in case user enters short url directly into address bar
    if (isUserUrl(shortUrl, user)) {
      let templateVars = {
        shortUrl: shortUrl,
        longUrl: urlDatabase[shortUrl].longUrl,
        user: user,
      };
      res.render('urls_show', templateVars);
    } else {
      res.redirect('/urls');
    }
  } else {
    res.redirect('/login');
  }

});

app.post('/urls/:shortUrl', (req, res) => {
  const user = getUser(req.cookies[userIdCookie]);
  const shortUrl = req.params.shortUrl;
  
  if (user) {
    if (isUserUrl(shortUrl, user)) {
      urlDatabase[shortUrl] = {
        longUrl: req.body.longUrl,
        userId: user.id,
      };

      const templateVars = {
        urls: urlsForUser(user.id),
        user: user,
      };
      res.render('urls_index', templateVars);
    } else {
      res.redirect('/urls');
    }
  } else {
    res.redirect('/login');
  }
});

// === /u/:shortUrl ===
app.get('/u/:shortUrl', (req, res) => {
  const longUrl = urlDatabase[req.params.shortUrl].longUrl;
  res.redirect(longUrl);
});


// ===== /urls/:shortUrl/delete =====
app.post('/urls/:shortUrl/delete', (req, res) => {
  const user = getUser(req.cookies[userIdCookie]);
  const shortUrl = req.params.shortUrl;

  if (user) {
    if (isUserUrl(shortUrl, user)) {
      delete urlDatabase[shortUrl];
      const templateVars = {
        urls: urlDatabase,
        user: user,
      };
      res.render('urls_index', templateVars);
    } else {
      res.redirect('/urls');
    }
  } else {
    res.redirect('/login');
  }
});

// ==== /login ====
app.get('/login', (req, res) => {
  const templateVars = {
    user: getUserByEmail(req.cookies[userIdCookie]),
  };
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
  let reqPw = req.body.password;

  if (reqEmail === '' || reqPw === '') {
    res.sendStatus(400);
  } else if (isRegisteredEmail(reqEmail)) {
    res.status(400).send('Email registered');
  } else {
    const hashedPw = bcrypt.hashSync(reqPw, saltRounds);
    reqPw = '';

    const user = {
      id: generateRandomString(6),
      email: reqEmail,
      password: hashedPw,
    };
    users[user.id] = user;
    console.log(users);
    res
      .cookie(userIdCookie, user.id)
      .redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}`);
});
