const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// Create schema
const userSchema = new Schema({
    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": String,
    "loginHistory": [ 
        { 
            "dateTime": Date, 
            "userAgent": String  
        } 
    ]
});

let User;

//initialize connection
function initialize() {
    return new Promise((resolve, reject) => {
        // Creating a connection
        
        let db = mongoose.createConnection("mongodb+srv://jcamana:Jaswin24@senecaweb.ebvbizr.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
        // Checking for errors
        db.on('error', (err)=>{
            reject(err);
        });
        // Checking for success
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });

    })
}


// => Create User Schema
function registerUser(userData) {
    return new Promise((resolve, reject) => {
        if (userData.password !== userData.password2) {
            reject("Passwords do not match");
        } else {
            // Hashing the password
            bcrypt.hash(userData.password, 10).then((hash) => {
                userData.password = hash;
                // Save user data
                let newUser = new User(userData);
                newUser.save().then(() => {
                    resolve();
                }).catch((err) => {
                    if (err.code === 11000) {
                        reject("User Name already taken");
                    } else {
                        reject(`There was an error creating the user: ${err}`);
                    }
                })
            })
            .catch((err) => {
                console.log(err);
                reject("There was an error encrypting the password")
            });
        
        }
    })
}

// => Checks login user
function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.find({ "userName": userData.userName }).exec()
        .then((users) => {
            if (users.length === 0) {
                reject(`Unable to find user: ${userData.userName}`);
            } else {
                // Checke if the passwords match
                bcrypt.compare(userData.password, users[0].password).then((result) => {
                    if (result === true) {
                        resolve(users[0]);
                    } else {
                        reject(`Here Incorrect Password for user: ${userData.userName}`);
                    }
                 });
                 // Update login history 
                users[0].loginHistory.push({
                    "dateTime": new Date().toString(),
                    "userAgent": userData.userAgent
                })
                // Update user database
                User.updateOne(
                    { "userName": users[0].userName },
                    { "$set": {"loginHistory": users[0].loginHistory} },
                    { "multi": false }
                ).exec().then(() => {
                    resolve(users[0]);
                }).catch((err) => {
                    reject(`There was an error verifying the user: ${err}`)
                })
            }
        }).catch(() => {
            reject(`Unable to find user: ${userData.userName}`);
        });
    })
}

// Exporting the functions
module.exports = {
    initialize,
    registerUser,
    checkUser
}