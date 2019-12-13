# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Features

- Encrypted session
- Hashed password storage
- Saved URLs per user

## Final Product

!["Main screen after logging in."](https://raw.githubusercontent.com/fgfl/tinyapp/master/docs/urls_page.png#thumbnail)
The main page has a list of all the URLs we have shortened. We can choose to edit them or delete them from here.

---

!["Page to generate a new short URL."](https://raw.githubusercontent.com/fgfl/tinyapp/master/docs/urls_create_page.png)
This page lets us shorten an URL. The shortened URL will be saved onto our main page.

---

!["Page to replace the actual URL for a the given short URL."](https://raw.githubusercontent.com/fgfl/tinyapp/master/docs/urls_edit_page.png)
The edit page lets us change the shortened URL to point to another URL.

---

!["Login page for Tiny App."](https://raw.githubusercontent.com/fgfl/tinyapp/master/docs/urls_login_page.png)
The user must login before they can shortened URLs.

---

!["New User Registration page."](https://raw.githubusercontent.com/fgfl/tinyapp/master/docs/urls_register_page.png)
The user can register for an new account if they do not have one.

