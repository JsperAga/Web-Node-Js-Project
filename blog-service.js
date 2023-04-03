const Sequelize = require('sequelize');
const { gte } = Sequelize.Op;

// initialize Sequelize application
var sequelize = new Sequelize('jzxzdnpx', 'jzxzdnpx', 'vlSRg9oMxHDZHAwwuwJZ6jPPt7Np_ZtD', {
    host: 'suleiman.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
   });

// Defining the Post Model
const Post = sequelize.define("Post", {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN,
  });
  
// Defining the Category Model
const Category = sequelize.define("Category", {
category: Sequelize.STRING,
});

// belongsTo Relationship
Post.belongsTo(Category, {foreignKey: 'category'});

// create array
let posts = [];
let categories = [];

// => initialize blog
// Remove this for Sequelize
// function initialize() {
//     // Ensures that the categories file is read and assigned first before usage
//     return new Promise((resolve, reject) => {
//         fs.readFile(path.join(__dirname, "data", "posts.json"), 'utf8', (err, data) => {
//             if (err) {
//                 reject("Unable to read posts file");
//             }
//             // Saving posts
//             posts = JSON.parse(data);
//             fs.readFile(path.join(__dirname, "data", "categories.json"), 'utf8', (err, data) => {
//                 if (err) {
//                         reject("Unable to read categories file");
//                 }
//                 // Saving categories
//                 categories = JSON.parse(data);
//                 resolve();
//               });
//           });
//     })
// }
function initialize() {
    // Checking for setup
    return new Promise((resolve, reject) => {
      sequelize
        .sync()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject("Unable to sync to the database.");
        });
    });
  }

// => Get all Post
function getAllPosts() {
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     if (posts.length === 0) {
    //         reject("No results returned");
    //     } else {
    //         resolve(posts);
    //     }
    // })

    return new Promise((resolve, reject) => {
        Post.findAll()
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject("No results returned");
          });
      });
}


// => get categories
function getCategories() {
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     if (categories.length === 0) {
    //         reject("no results returned");
    //     } else {
    //         resolve(categories);
    //     }
    // })
    return new Promise((resolve, reject) => {
        Category.findAll()
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject("No results returned");
          });
      });
};

// => Find posts by minDate
function getPostsByMinDate(minDate) {
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     const filteredPosts = posts.filter(post => new Date(post.postDate) >= new Date(minDate));

    //     if (filteredPosts.length > 0) {
    //         resolve(filteredPosts);
    //     } else {
    //         reject("no results returned");
    //     }
    // })

    return new Promise((resolve, reject) => {
        Post.findAll({
          where: {
            postDate: {
              [gte]: new Date(minDateStr),
            },
          },
        })
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject("No results returned");
          });
      });
};

// => post add post
function addPost(postData) {
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     if (postData.published === undefined) {
    //         postData.published = false;
    //     } else {
    //         postData.published = true;
    //     }

    //     // create new Post ID
    //     postData.id = posts.length + 1;
        
    //     // Add new post
    //     posts.push(postData);
    //     resolve(postData);
    // });
    return new Promise((resolve, reject) => {
        // Ensure published property is set correctly
        postData.published = postData.published ? true : false;
    
        // Making sure that the empty values are null
        for (const i in postData) {
          if (postData[i] === "") {
            postData[i] = null;
          }
        }
    
        // Setting the date
        postData.postDate = new Date();
    
        // Create a new Post using the postData
        Post.create(postData)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject("Unable to create post");
          });
      });
};


// => get post by Id
function getPostById(id){
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     const filteredPosts = posts.filter(post => post.id == id);
    //     const uniqueId = filteredPosts[0];
    //     if (uniqueId){
    //         resolve(filteredPosts);
    //     } else {
    //         reject("no results returned");
    //     }
    // })
    return new Promise((resolve, reject) => {
        Post.findAll({
          where: {
            id: id,
          },
        })
          .then((data) => {
            resolve(data[0]);
          })
          .catch(() => {
            reject("No results returned");
          });
      });
};


// => get publish post
function getPublishedPosts() {
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     let publishedPosts = [];
    //     posts.forEach((post) => {
    //         if (post.published === true) {
    //             publishedPosts.push(post);
    //         }
    //     })

    //     if (publishedPosts.length > 0) {
    //         resolve(publishedPosts);
    //     } else {
    //         reject("no results returned");
    //     }
    // })    
    return new Promise((resolve, reject) => {
        Post.findAll({
          where: {
            published: true,
          },
        })
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject("No results returned");
          });
      });
}


// => get publish post by category
function getPublishedPostsByCategory(category) {
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     let publishedPosts = [];
    //     posts.forEach((post) => {
    //         if (post.published === true && post.category == category) {
    //             publishedPosts.push(post);
    //         }
    //     })

    //     if (publishedPosts.length > 0) {
    //         resolve(publishedPosts);
    //     } else {
    //         reject("no results returned");
    //     }
    // })    
    return new Promise((resolve, reject) => {
        Post.findAll({
          where: {
            category: category,
            published: true,
          },
        })
          .then((data) => {
            resolve(data);
          })
          .catch(() => {
            reject("No results returned");
          });
      });
  };

  // => Find posts by category
function getPostsByCategory(category) {
  // Remove this for Sequelize
    // return new Promise((resolve, reject) => {
    //     const filteredPosts = posts.filter(post => post.category == category);

    //     if (filteredPosts.length > 0) {
    //         resolve(filteredPosts);
    //     } else {
    //         reject("no results returned");
    //     }
    // })

    return new Promise((resolve, reject) => {
        Post.findAll({
          where: {
            category: category,
          },
        })
          .then((data) => {
            console.log(category);
            resolve(data);
          })
          .catch(() => {
            reject("No results returned");
          });
      });
};

// => Adds a new category
function addCategory(categoryPost) {
    return new Promise((resolve, reject) => {
      for (let i in categoryPost) {
        if (categoryPost[i] === "") {
          categoryPost[i] = null;
        }
      }
  
      Category.create(categoryPost)
        .then((category) => {
          resolve(category);
        })
        .catch(() => {
          reject("unable to create category");
        });
    });
  }

  // => Delete a category by id
function deleteCategoryById(id) {
  return new Promise((resolve, reject) => {
    Category.destroy({
      where: {
        id: id,
      },
    })
      .then(() => {
        resolve("Destroyed");
      })
      .catch(() => {
        reject("Unable to delete category");
      });
  });
}

// => Delete a post by id
function deletePostById(id) {
  return new Promise((resolve, reject) => {
    Post.destroy({
      where: {
        id: id,
      },
    })
      .then(() => {
        resolve("Destroyed");
      })
      .catch(() => {
        reject("Unable to delete post");
      });
  });
}


module.exports = { initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostsByCategory, getPostsByMinDate, getPostById, getPublishedPostsByCategory,addCategory,deleteCategoryById,deletePostById };