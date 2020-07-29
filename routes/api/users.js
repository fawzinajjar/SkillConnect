// Register user And save the data after validation to data base
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User  = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config')
// @route   POST api/Users //
// @desc    Register //
// @access  Public //

router.post('/',
[
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
//validating the request sent
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // registering the user
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json( [{ msg: "User Already Exists" }] )
        }
        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })
        user = new User({
            name,
            email,
            avatar,
            password
        });
        // bcrypting the password //
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        // saved the user to mongodb webstorage.
        await user.save();

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