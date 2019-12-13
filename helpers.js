/**
 * Dec 12, 2019
 * Frederick Lee
 */


// Helper functions
/**
 * Checks if the email is already in the database or not
 * @param {string} email
 * @param {object} userDatabase users database
 * @returns {boolean} true if email is in the database. false otherwise
 */
const isRegisteredEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return true;
    }
  }
  return false;
};

/**
 * Gets the user object given the user ID
 * @param {string} userId The code for the specific user. The code is generated with our random string function
 * @param {object} userDatabase users database
 * @returns {object} user object. undefined if not found
 */
const getUser = (userId, userDatabase) => {
  return userDatabase[userId];
};

/**
 * Finds the user object in the "users" database given the email
 * @param {string} email email registerd with the user to find
 * @param {object} userDatabase users database
 * @returns {object} the user object. null if not found.
 */
const getUserByEmail = (email, userDatabase) => {
  for (const userId in userDatabase) {
    if (userDatabase[userId].email === email) {
      return userDatabase[userId];
    }
  }
};

/**
 * Returns an object of all the URLs in urlDatabase that belong to user
 * @param {string} user user's id from the user object {id, email, password}
 * @param {object} urlDatabase URL database
 * @returns {obj}
 */
const urlsForUser = (id, urlDatabase) => {
  const userUrls = {};
  for (const shortUrlKey in urlDatabase) {
    if (urlDatabase[shortUrlKey].userId === id) {
      userUrls[shortUrlKey] = urlDatabase[shortUrlKey];
    }
  }
  return userUrls;
};

/**
 * Checks if the url is in our database
 * @param {string} shortUrl key of urlDatabase
 * @param {object} urlDatabase url database
 * @returns {boolean} true if short url is in the database. false otherwise
 */
const isValidUrl = (shortUrl, urlDatabase) => {
  if (urlDatabase[shortUrl]) {
    return true;
  }
  return false;
};

/**
 * Checks if the shortUrl belongs to the user
 * @param {string} shortUrl key of urlDatabase
 * @param {object} user user object
 * @param {object} urlDatabase URL database
 * @returns {boolean} true if the url's user id is user.id. false otherwise
 */
const isUserUrl = (shortUrl, user, urlDatabase) => {
  if (isValidUrl(shortUrl, urlDatabase) && urlDatabase[shortUrl].userId === user.id) {
    return true;
  }
  return false;
};


module.exports = {
  isRegisteredEmail,
  getUser,
  getUserByEmail,
  urlsForUser,
  isUserUrl,
  isValidUrl,
};