/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Jasper Aga Camana__ Student ID: _171139215____ Date: Febuary 16, 2023
*
* Cyclic Web App URL: __https://real-plum-sweatpants.cyclic.app_______________
*
* GitHub Repository URL: ___https://github.com/JsperAga/web322-app.git_________
*
********************************************************************************/
const express = require("express");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const path = require("path");
const { 
  initialize, 
  getAllPosts, 
  getPublishedPosts, 
  getCategories, 
  addPost, 
  getPostsByCategory, 
  getPostsByMinDate,
  getPostById
} = require("./blog-service.js");

const app = express();

// Set Public folder as Static
app.use(express.static('public')); 

cloudinary.config({
  cloud_name: 'drrrcpjvu',
  api_key: '648918882643245',
  api_secret: 'PcxoMCxv9Mdl331Gv7DhBx2F7hg',
  secure: true
 });

// no { storage: storage } since we are not using disk storage
const upload = multer(); 

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
    if(req.query.category){
      getPostsByCategory(req.query.category)
      .then((data) => {
        res.send(data);
      })
      .catch((err) =>{
        res.send(err);
      });
    } 
    else if (req.query.minDate){
      getPostsByMinDate(req.query.minDate)
      .then((data) => {
        res.send(data);
      })
      .catch((err) =>{
        res.send(err);
      });
    }
    else {
      getAllPosts()
          .then((data) => {
            res.send(data)
          })
        
          .catch((err) => {
            res.send(err);
          })

    } 
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
});

// ========== Add Post Page (GET) ==========
app.get("/posts/add", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "addPost.html"));
});

// ========== Add Post Page (POST) ==========
app.post("/posts/add", upload.single("featureImage"), (req, res) => {
  if(req.file){
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
      streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    
    async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
    }
    upload(req).then((uploaded)=>{
    processPost(uploaded.url);

    req.body.featureImage = uploaded.url;
    let postObject = {};

    // create individual posting
    postObject.body = req.body.body;
    postObject.title = req.body.title;
    postObject.postDate = getdate();
    postObject.category = parseInt(req.body.category);
    postObject.featureImage = req.body.featureImage;
    postObject.published = req.body.published;
    
    
    // create a post
    if (postObject.title) {
      addPost(postObject);
    }
    res.redirect("/posts");
    })
     // Error Handling
    .catch((err) => {
      res.send(err);
    });
  }else{
      // else if no image posted
      processPost("");
      req.body.featureImage = "";
      let postObject = {};

      // create individual posting
      postObject.body = req.body.body;
      postObject.title = req.body.title;
      postObject.postDate = getdate();
      postObject.category = parseInt(req.body.category);
      postObject.featureImage = req.body.featureImage;
      postObject.published = req.body.published;
            
       // create a post
      if (postObject.title) {
        addPost(postObject);
      }
    res.redirect("/posts");      
  }

  function processPost(imageUrl){
    req.body.featureImage = imageUrl;
    // add image process
  } 

  // create date format
  function getdate(){
    var dt = new Date();

    year  = dt.getFullYear();
    month = (dt.getMonth() + 1).toString().padStart(2, "0");
    day   = dt.getDate().toString().padStart(2, "0");

    return year+"-"+month+"-"+day;
  }
});

// ========== get post by ID ==========
app.get("/post/:value", (req, res) => {
  getPostById(req.params.value)
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    res.send(err);
  });
});


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






