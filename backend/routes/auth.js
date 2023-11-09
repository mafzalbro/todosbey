const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'afzalbey@fun';

const fetchuser = require('./middleware/fetchuser')

const router = express.Router();
const { body, validationResult } = require('express-validator');


const User = require('../models/User');

// Route 1: create a user using send POST "/api/auth/createuser". No login required

router.post('/createuser', [

  body('name','Enter valid name please!').isLength({min : 3}),
    body('email','Enter valid email please!').isEmail(),
    body('password','Enter valid password please!').isLength({min: 5})

],

  async (req, res)=> {

    //if error then return bad response and errors messages

    const errors = validationResult(req);

    if(!errors.isEmpty()) return res.status(400).json({errors:errors.array()})

    // creating validation and save in database

    // Check whether the user with this email exists already

    try {
      
      let user  = await User.findOne({email: req.body.email});
      
      if (user) return res.status(400).json({error: "Sorry a user with this email already exists"});
      
      const salt = await bcrypt.genSalt(10);
      const secretPass = await bcrypt.hash(req.body.password, salt)
      
      user = await User.create ({
        name: req.body.name,
        password: secretPass,
        email: req.body.email,
    })

    // create json-web-token for authentication

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);

    // console.log(authtoken);

    // return res.json(user)
    return res.json({authtoken})

  } catch (error) {
    console.error("Facing Issue in Saving in DB. Please Try Again!");
    if(error) return res.status(500).json({error: "Internal Server Error"});
  }
})


router.get('/createuser', async (req, res)=> {
  
  const user = await User.find()
  // let user = await User.find({"__v": "0"})

  return res.json(user)
})


// --- Route 2: Authenticating user with POST method on "/api/auth/login". No login required

router.post('/login', [
  body('email','Enter valid email please!').isEmail(),
  body('password','Password cannot be blank!').exists().isLength({min: 5})
],

async (req, res)=>{
  //checking errors
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors:errors.array().map(err => err.msg)})

  const {email, password} = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Please try to login with correct credentials" });

    //comparing passwords if available in database to login
    const passwordCompare = await bcrypt.compare(password, user.password); //returns true | false

    // console.log(passwordCompare, password, user.password);
    // if pw compare results false, we will give error
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id,
      }
    };

    const authtoken = jwt.sign(data, JWT_SECRET);

    return res.json({authtoken});
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
 
  // res.send(req.body)
})

// Route 3: Getting logged in user "/api/auth/getuser" - Login Required

router.post('/getuser', fetchuser, async (req, res) => {

  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    return res.send(user)
  } catch (error) {
    return res.status(500).json("Internal Server Error")
  }
  })

module.exports = router