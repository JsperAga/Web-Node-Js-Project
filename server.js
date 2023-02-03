/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Jasper Aga Camana__ Student ID: _171139215____ Date: January 17, 2023
*
* Cyclic Web App URL: __https://real-plum-sweatpants.cyclic.app________________
*
* GitHub Repository URL: ______________________________________________________
*
********************************************************************************/
const express = require("express");
const path = require("path");
const { initialize, getAllPosts, getPublishedPosts, getCategories } = require("./blog-service.js");

const app = express();

// Set Public folder as Static Folder
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

// ========== Blog Page Route ==========
app.get("/blog", (req, res) => {
  getPublishedPosts()
  .then((data) => {
    res.send(data)
  })
  // Error Handling
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
    // Error Handling
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
  // Error Handling
  .catch((err) => {
    res.send(err);
  })
})

// ========== HANDLE 404 REQUESTS ==========
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "PageNotFound.html"));
})

// ========== Setup http server to listen on HTTP_PORT ==========
initialize().then(() => {
  // Start the server after the files are read and the initialization is done
  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
})






