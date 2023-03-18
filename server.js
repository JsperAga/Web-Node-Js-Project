/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: _Jasper Aga Camana__ Student ID: _171139215____ Date: March 17, 2023
*
* Cyclic Web App URL: __https://real-plum-sweatpants.cyclic.app_______________
*
* GitHub Repository URL: ___https://github.com/JsperAga/web322-app.git_________
*
********************************************************************************/
const express = require("express");
const app = express();
const blogData = require("./blog-service.js");
const { 
  initialize, 
  getAllPosts, 
  getPublishedPosts, 
  getCategories, 
  addPost, 
  getPostsByCategory, 
  getPostsByMinDate,
  getPostById,
  getPublishedPostsByCategory
} = require("./blog-service.js");
const multer = require("multer");
const streamifier = require('streamifier');
const exphbs  = require('express-handlebars');
const stripJs = require("strip-js");
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const path = require("path");

// => Set Public folder as Static
app.use(express.static('public')); 

cloudinary.config({
  cloud_name: 'drrrcpjvu',
  api_key: '648918882643245',
  api_secret: 'PcxoMCxv9Mdl331Gv7DhBx2F7hg',
  secure: true
 });

 // => route properties
app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
 });

 
// Define a custom Handlebars helper function to format dates
const hbs = exphbs.create({
  helpers: {
      formatDate: function (date) {
          return date;
      },
      navLink: function(url, options){
        return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
      },
      safeHTML: function (context) {
        return stripJs(context);
      },
       
  },
  extname:".hbs"
});

// Register handlebars as the rendering engine for views
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Use body-parser middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

// no { storage: storage } since we are not using disk storage
const upload = multer(); 

const HTTP_PORT = process.env.PORT || 8080;

// ========== Home Page  ==========
app.get("/", (req,res) => {
  res.redirect("/blog");
});

// ========== About Page ==========
// app.get("/about", (req, res) => {
//     res.sendFile(path.join(__dirname, "views/layouts", "main.hbs"));
// })
app.get("/about", async (req, res) => {
  res.render("about");
});


// ========== Blog Page ==========
app.get("/blog", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {}
  try {
    // declare empty array to hold "post" objects
    let posts = []

    //if there's a "category" query, filter the returned posts by category
    if (req.query.category) {
      // Obtain the published "posts" by category
      posts = await blogData.getPublishedPostsByCategory(req.query.category)
     } else {
      // Obtain the published "posts"
      posts = await blogData.getPublishedPosts()
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate))

    // get the latest post from the front of the list (element 0)
    let post = posts[0]

    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts
    viewData.post = post
  } catch (err) {
    viewData.message = "no results"
  }

  try {
    // Obtain the full list of "categories"
    let categories = await blogData.getCategories()

    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results"
  }

  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData })
});


// ========== Blog Page with ID ==========
app.get("/blog/:id", async (req, res) => {
  // Declare an object to store properties for the view
  let viewData = {};
  try {
    // declare empty array to hold "post" objects
    let posts = [];
    // if there's a "category" query, filter the returned posts by category
    if (req.query.category) {

      // Obtain the published "posts" by category
      posts = await blogData.getPublishedPostsByCategory(req.query.category);
     
    } else {
      // Obtain the published "posts"
      posts = await blogData.getPublishedPosts();
    }

    // sort the published posts by postDate
    posts.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    // store the "posts" and "post" data in the viewData object (to be passed to the view)
    viewData.posts = posts;
    viewData.post = post
  } catch (err) {
  
    viewData.message = "no results";
  }
  try {
    // Obtain the post by "id"
    viewData.post = await blogData.getPostById(req.params.id); 
    viewData.post = viewData.post[0]; // resolve issues with single blog post

  } catch (err) {
    console.log(err)
    viewData.message = "no results";
  }
  try {
    // Obtain the full list of "categories"
    let categories = await blogData.getCategories();
    // store the "categories" data in the viewData object (to be passed to the view)
    viewData.categories = categories;
  } catch (err) {
    viewData.categoriesMessage = "no results";
  }
  // render the "blog" view with all of the data (viewData)
  res.render("blog", { data: viewData });
});

// ========== Posts Page OLD ==========
// app.get("/posts", (req, res) => {
//     if(req.query.category){
//       getPostsByCategory(req.query.category)
//       .then((data) => {
//         res.send(data);
//       })
//       .catch((err) =>{
//         res.send(err);
//       });
//     } 
//     else if (req.query.minDate){
//       getPostsByMinDate(req.query.minDate)
//       .then((data) => {
//         res.send(data);
//       })
//       .catch((err) =>{
//         res.send(err);
//       });
//     }
//     else {
//       getAllPosts()
//           .then((data) => {
//             res.send(data)
//           })
        
//           .catch((err) => {
//             res.send(err);
//           })

//     } 
// });

// ========== Posts Page ==========
app.get("/posts", function(req,res){
  if (req.query.category) {
    getPostsByCategory(req.query.category)
      .then((data) => {
        data.length > 0
          ? res.render("posts", { posts: data })
          : res.render("posts", { message: "No Results" });
      })     
      .catch((err) => {
        res.render("posts", { message: "no results" });
      });
  }
  else if (req.query.minDate) {
    getPostsByMinDate(req.query.minDate)
      .then((data) => {
        data.length > 0
          ? res.render("posts", { posts: data })
          : res.render("posts", { message: "No Results" });
      })    
      .catch((err) => {
        res.render("posts", { message: "no results" });
      });
  }  
  else {
    getAllPosts()
      .then((data) => {
        data.length > 0
          ? res.render("posts", { posts: data })
          : res.render("posts", { message: "No Results" });
      })    
      .catch((err) => {
        res.render("posts", { message: "no results" });
      });
  }
});

// ========== Categories Page ==========
app.get("/categories", (req, res) => {
  getCategories()
      .then((data) => {
        data.length > 0
          ? res.render("categories", { category: data })
          : res.render("categories", { message: "No Results" });
      })
      .catch((err) => {
        res.render("categories", { message: "no results" });
      });
});

// ========== Add Post Page (GET) ==========
// app.get("/posts/add", (req, res) => {
//   res.sendFile(path.join(__dirname, "views", "addPost.html"));
// });

app.get("/posts/add", (req, res) => {
  res.render("addPost");
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
// app.use((req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "views", "PageNotFound.html"));
// })
app.use((req, res) => {
  res.status(404).render("404");
});

// ========== Setup Server Response ==========
initialize().then(() => {
  // The integrated terminal shows "Express http server listening on 8080"
  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
})






