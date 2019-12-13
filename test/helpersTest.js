/**
 * Dec 12, 2019
 * Frederick Lee
 */

const assert = require('chai').assert;

const {
  isRegisteredEmail,
  getUser,
  getUserByEmail,
  urlsForUser,
  isValidUrl,
  isUserUrl,
} = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
};

const testUrlsDb = {
  'short1': {
    longUrl: 'http://www.example.com',
    userId: 'userRandomID',
  },
  'short2': {
    longUrl: 'http://www.google.com',
    userId: 'user2RandomID',
  },
  'short3': {
    longUrl: 'http://www.domain.com',
    userId: 'userRandomID',
  },
};

describe('#isRegisteredEmail()', () => {
  it('should return true if the email is in the database', () => {
    assert.isTrue(isRegisteredEmail('user@example.com', testUsers));
  });
  it('should return false if the email is not in the database', () => {
    assert.isNotTrue(isRegisteredEmail('notAUser@example.com', testUsers));
  });
});

describe('#getUser()', () => {
  it('should return a user with a given valid ID', () => {
    const user = getUser('userRandomID', testUsers);
    const  expectedOutput = testUsers.userRandomID;
    assert.deepEqual(user, expectedOutput);
  });
  it('should return undefined with an given invalid ID', () => {
    const user = getUser('noUser@example.com', testUsers);
    const  expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('#getUserByEmail()', () => {
  it('should return a user with a valid email', () => {
    const user = getUserByEmail('user@example.com', testUsers);
    const  expectedOutput = testUsers.userRandomID;
    assert.deepEqual(user, expectedOutput);
  });
  it('should return undefined with an invalid email', () => {
    const user = getUserByEmail('noUser@example.com', testUsers);
    const  expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });
});

describe('#urlsForUser()', () => {
  it('should return the urls that belong to the user (userRandomID)', () => {
    const id = 'userRandomID';
    const expectedOutput = {
      'short1': testUrlsDb.short1,
      'short3': testUrlsDb.short3,
    };
    assert.deepEqual(urlsForUser(id, testUrlsDb), expectedOutput);
  });
  it('should return the urls that belong to the user (user2RandomID)', () => {
    const id = 'user2RandomID';
    const expectedOutput = {
      'short2': testUrlsDb.short2,
    };
    assert.deepEqual(urlsForUser(id, testUrlsDb), expectedOutput);
  });
  it('should return an empty object if there are no URLs for the given id', () => {
    const id = 'someUser';
    const expectedOutput = {};
    assert.deepEqual(urlsForUser(id, testUrlsDb), expectedOutput);
  });
});

describe('#isValidUrl()', () => {
  it('should return true if the url is in database', () => {
    const shortUrl = 'short1';
    assert.isTrue(isValidUrl(shortUrl, testUrlsDb));
  });
  it('should return false if the url is not in the database', () => {
    const shortUrl = 'invalidShortUrl';
    assert.isNotTrue(isValidUrl(shortUrl, testUrlsDb));
  });
});

describe('#isUserUrl()', () => {
  it('should return true if the url belongs to the given user', () => {
    const shortUrl = 'short1';
    const user = testUsers.userRandomID;
    assert.isTrue(isUserUrl(shortUrl, user, testUrlsDb));
  });
  it('should return false if the url does not belongs to the given user (invalid url)', () => {
    const shortUrl = 'invalidShortUrl';
    const user = testUsers.userRandomID;
    assert.isNotTrue(isUserUrl(shortUrl, user, testUrlsDb));
  });
  it('should return false if the url does not belongs to the given user (invalid user)', () => {
    const shortUrl = 'short1';
    const user = testUsers.user2RandomID;
    assert.isNotTrue(isUserUrl(shortUrl, user, testUrlsDb));
  });
});