const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
    }
}

// Login :
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Adding a book review :
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn]
  if (book) {
    let reviews = req.body.reviews;

    if(reviews) {
        book["reviews"] = reviews
    }

    books[isbn]=book;
    res.send('Your review has been successfully added!');
  }
  else{
    res.send('Your review was unable to be added.');
  }
});

// Deleting a book review :
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const keys = Object.keys(books);
    const isbn = req.params.isbn;    
    if (isbn){
        delete books[isbn].review
        res.send(`Your review has been deleted.`);
    }
    else {
        res.send("Could not delete review")
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;