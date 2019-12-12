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
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {
  isRegisteredEmail,
  getUser,
  getUserByEmail,
  urlsForUser,
  isUserUrl,
} = require('./helper');

const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['allowa', 'saiekdl', '3k3kd9w-gh', 'kd92-vnsl', '0dkdj1vlas'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Global Data structure for storage
const userIdCookie = 'user_id';
const saltRounds = 10;

const urlDatabase = {
  'b2xVn2': {longUrl: 'http://www.lighthouselabs.ca', userId: 'userRandomID'},
  '9sm5xK': {longUrl: 'http://www.google.com', userId: 'aJ48lW'},
};

const users = {
  'userRandomID': {
    id: 'userRandomID',
    email: 'random@hotmail.com',
    password: bcrypt.hashSync('password', saltRounds),
  },
};



//==============================
// Endpoints
//==============================
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
  const user = getUser(req.session[userIdCookie], users);

  if (user) {
    userUrls = urlsForUser(user.id, urlDatabase);
  }

  const templateVars = {
    urls: userUrls,
    user: user,
  };
  res.render('urls_index', templateVars);
});

app.post('/urls', (req, res) => {
  const shortUrl = generateRandomString(6);
  const user = getUser(req.session[userIdCookie], users);
  urlDatabase[shortUrl] = {
    longUrl: req.body.longUrl,
    userId: user.id,
  };

  res.redirect(`/urls/${shortUrl}`);
});

// === /urls/new ====
app.get('/urls/new', (req, res) => {
  const user = getUser(req.session[userIdCookie], users);
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
  const user = getUser(req.session[userIdCookie], users);

  if (user) {
    // need to check this in case user enters short url directly into address bar
    if (isUserUrl(shortUrl, user, urlDatabase)) {
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
  const user = getUser(req.session[userIdCookie], users);
  const shortUrl = req.params.shortUrl;
  
  if (user) {
    if (isUserUrl(shortUrl, user, urlDatabase)) {
      urlDatabase[shortUrl] = {
        longUrl: req.body.longUrl,
        userId: user.id,
      };

      const templateVars = {
        urls: urlsForUser(user.id, urlDatabase),
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
  const user = getUser(req.session[userIdCookie], users);
  const shortUrl = req.params.shortUrl;

  if (user) {
    if (isUserUrl(shortUrl, user, urlDatabase)) {
      delete urlDatabase[shortUrl];
      const templateVars = {
        urls: urlsForUser(user.id, urlDatabase),
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
    user: getUser(req.session[userIdCookie], users),
  };
  res.render('urls_login', templateVars);
});

app.post('/login', (req, res) => {
  const reqEmail = req.body.email;
  let reqPw = req.body.password;

  const user = getUserByEmail(reqEmail, users);
  if (user && bcrypt.compareSync(reqPw, user.password)) {
    reqPw = '';
    req.session[userIdCookie] = user.id;
    res.redirect('/urls');
  } else {
    res.status(403).send('Invalid login');
  }
});

// ==== /logout ====
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
});

// ==== /register =====
app.get('/register', (req, res) => {
  const templateVars = {
    user: getUser(req.session[userIdCookie], users),
  };
  res.render('urls_register', templateVars);
});

app.post('/register', (req, res) => {
  const reqEmail = req.body.email;
  let reqPw = req.body.password;

  if (reqEmail === '' || reqPw === '') {
    res.sendStatus(400);
  } else if (isRegisteredEmail(reqEmail, users)) {
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
    req.session[userIdCookie] = user.id;
    res.redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening to port ${PORT}`);
});
