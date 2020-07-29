// login authenticating user
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// @route   Post api/auth //
// @desc    Authenticate user and get token //
// @access  Public //

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');    
    }
  }
);


// @route   POST api/Users //
// @desc    Register //
// @access  Public //

router.post('/',
[
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
//validating the request sent
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // registering the user
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json( [{ msg: "Invalid Credentials" }] )
        }

        // compare password if it is valid
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json( [{ msg: "Invalid Credentials" }] )
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        // Signing the token //
        jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000000000 }, 
        (err, token) => { 
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

    
}); 


module.exports = router;