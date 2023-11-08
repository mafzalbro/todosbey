const express = require('express')
const bcrypt = require('bcryptjs');

const router = express.Router();
const { body, validationResult } = require('express-validator');


const User = require('../models/User');



// create a user using send POST "/api/auth/createuser". 

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
      
      let user  = await User.findOne ({email: req.body.email});
      
      if (user) return res.status(400).json({error: "Sorry a user with this email already exists"});
      
      const salt = await bcrypt.genSalt(10);
      const secretPass = await bcrypt.hash(req.body.password, salt)
      
      user = await User.create ({
        name: req.body.name,
        password: secretPass,
        email: req.body.email,
    })
    
    return res.json(user)

  } catch (error) {
    console.error("Facing Issue in Saving in DB. Please Try Again!");
    if(error) return res.status(500).json({error: "Internal Server Error"});
  }
})


router.get('/createuser', async (req, res)=> {
  
  let user = await User.find({"__v": "0"})

  return res.json(user)
})
module.exports = router