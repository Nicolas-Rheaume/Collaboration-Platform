const express = require('express');
const router = express.Router();

const passport = require('passport');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');
const db = require('../middleware/sequelize.mw');
const User = require('../models/user.model.js');

// Register a new user
router.post('/register', (req, res, next) => {
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });
 
  User.create(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Get All Users
router.get('/getUsers', (req, res) => {
  User.findAll()
    .then(users => {
      res.json(users);
    })
    .catch(err => console.log(err));
});

// Create a new User
router.post('/create', (req, res, next) => {

  let newUser = {
    username: '',
    email: '',
    password: '',
    role: 0,
  }

  if(req.body.hasOwnProperty('username')) { newUser.username = req.body.username; }
  else if(req.body.hasOwnProperty('email')) { newUser.username = req.body.email; }
  else if(req.body.hasOwnProperty('password')) { newUser.username = req.body.password; }
  else if(req.body.hasOwnProperty('role')) { newUser.username = req.body.role; }

  User.create(newUser).then((user) => {
    res.json(user);
  });
});

router.post('/delete', (req, res) => {

  User.destroy({
    where: {
      id: req.body.id,
      username: req.body.username
    }
  }).then(() => {
    res.json({success: true, msg:'User deleted'});
  });
});

router.get('/user', (req, res) => {
  res.json({success: true, msg:'User registered'});
});

module.exports = router;

  /*
  // Create User table
  app.get('/createUserTable', (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, username)'
  });

    // Create Connection
    const db = mysql.createConnection({
        host        : 'localhost',
        user        : 'root',
        password    : 'password',
        database    : 'nodemysql'
    });

    // Connect
    db.connect((err) => {
        if(err){
            throw err;
        }
        console.log('MySql Connected...');
    });

    // Create DB
    app.get('/createdb', (req, res) => {
        let sql = 'CREATE DATABASE nodemysql';
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            res.send('Database created...');
        });
    });
}




const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../helpers/database');
const User = require('../../models/api/user.model');

// Register
router.post('/signup', (req, res, next) => {
  let newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.firstname,
    username: req.body.username,
    password: req.body.password,
    admin: false
  });

  User.create(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Failed to register user'});
    } else {
      res.json({success: true, msg:'User registered'});
    }
  });
});

// Authenticate
router.post('/login', (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            admin: user.admin
          }
        });
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});
});

module.exports = router;
*/
