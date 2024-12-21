const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    return res.status(400).json({ message: "Please provide both a username and a password to register." });
  }
  if (users.includes(username)) {
    return res.status(409).json({ message: "The provided username is already in use. Please choose a different username." });
  }
  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User registration successful!" });
});

// Getting books list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books));
});

// Getting books details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = parseInt(req.params.isbn);
  if (isbn in books) {
    return res.send({
      isbn: isbn,
      ...books[isbn]
    });
  }
  return res.status(404).json({ message: "The book with the specified ISBN was not found." });
});


// Getting books details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let authorbooks = [];
  for (const isbn in books) {
    if (books[isbn]["author"] === author) {
      authorbooks.push({ isbn: isbn, ...books[isbn] });
    }
  }
  if (authorbooks.length > 0) {
    return res.send(authorbooks);
  }
  return res.status(404).json({ message: "No books were found for the specified author." });
});


// Getting books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let titlebooks = [];
  for (const isbn in books) {
    if (books[isbn]["title"] === title) {
      titlebooks.push({ isbn: isbn, ...books[isbn] });
    }
  }
  if (titlebooks.length > 0) {
    return res.send(titlebooks);
  }
  return res.status(404).json({ message: "No books were found with the specified title." });
});


// Task 10 :Asynchronous version code for getting the 
// list of books available in the shop using async-await with Axios.
// public_users.get('/', async function (req, res) {
//     try {
//         const response = await axios.get("https://api.example.com/books");
//         res.status(200).json({ message: response.data });
//     } catch (error) {
//         console.error("An error occurred while retrieving the book list: " + error);
//         res.status(500).json({ errorMessage:
//              "An internal error occurred while retrieving the book list. Please try again later." });
//     }
// });

// // Task 11: Promise for getting the book details based on ISBN
// public_users.get("/isbn/:isbn",(req, res) => {
//     const getBook = new Promise(() => {
//       const bookISBN = req.params.isbn;
//       res.send(books[bookISBN]);
//     })
// })

// // Task 12 : Asynchronous version searching book based on author
// public_users.get('/author/:author', async function (req, res) {
//     try {
//         const response = await axios.get("https://api.example.com/books");
//         const books = response.data;
//         const author = req.params.author;
//         let authorbooks = [];
//         for (const isbn in books) {
//             if (books[isbn]["author"] === author) {
//                 authorbooks.push({ isbn: isbn, ...books[isbn] });
//             }
//         }
//         if (authorbooks.length > 0) {
//             return res.send(authorbooks);
//         }
//         return res.status(404).json({ message: 
//             "No books found for the specified author." });
//     } catch (error) {
//         console.error("An error occurred while retrieving books: " + error);
//         res.status(500).json({ errorMessage:
//              "An internal error occurred while processing your request." });
//     }
// });

// // Task 13 : Asynchronous version searching book based on title
// public_users.get('/title/:title', async function (req, res) {
//     try {
//         const response = await axios.get("https://api.example.com/books");
//         const books = response.data;
//         const title = req.params.title;
//         let titlebooks = [];
//         for (const isbn in books) {
//             if (books[isbn]["title"] === title) {
//                 titlebooks.push({ isbn: isbn, ...books[isbn] });
//             }
//         }
//         if (titlebooks.length > 0) {
//             return res.send(titlebooks);
//         }
//         return res.status(404).json({ message:
//              "No books found matching the requested title." });
//     } catch (error) {
//         console.error("An error occurred while retrieving books: " + error);
//         res.status(500).json({ errorMessage:
//              "An internal error occurred while processing your request." });
//     }
// });

// Getting the books review 
public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn);
    if (isbn in books) {
      const reviews = books[isbn]["reviews"];
      if (JSON.stringify(reviews) === "{}") {
        return res.send("No reviews are available for this book.");
      }
      return res.send(books[isbn]["reviews"]);
    }
    return res.status(404).json({ message: 
        "The book with the specified ISBN was not found." });
  });
  
  module.exports.general = public_users;