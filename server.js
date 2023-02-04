/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Jasper Aga Camana__ Student ID: _171139215____ Date: Febuary 3, 2023
*
* Cyclic Web App URL: __https://real-plum-sweatpants.cyclic.app________________
*
* GitHub Repository URL: ___https://github.com/JsperAga/web322-app.git_________
*
********************************************************************************/
const express = require("express");
const path = require("path");
const { initialize, getAllPosts, getPublishedPosts, getCategories } = require("./blog-service.js");

const app = express();

// Set Public folder as Static
app.use(express.static('public')); 

const HTTP_PORT = process.env.PORT || 8080;

// ========== Home Page  ==========
app.get("/", (req,res) => {
  res.redirect("/about");
});

// ========== About Page ==========
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
})

// ========== Blog Page ==========
app.get("/blog", (req, res) => {
  getPublishedPosts()
  .then((data) => {
    res.send(data)
  })
  
  .catch((err) => {
    res.send(err);
  })
});

// ========== Posts Page ==========
app.get("/posts", (req, res) => {
  getAllPosts()
    .then((data) => {
      res.send(data)
    })
  
    .catch((err) => {
      res.send(err);
    })
});

// ========== Categories Page ==========
app.get("/categories", (req, res) => {
  getCategories()
  .then((data) => {
    res.send(data)
  })
 
  .catch((err) => {
    res.send(err);
  })
})

// ========== HANDLE 404 REQUESTS ==========
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "PageNotFound.html"));
})

// ========== Setup Server Response ==========
initialize().then(() => {
  // The integrated terminal shows "Express http server listening on 8080"
  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
})






