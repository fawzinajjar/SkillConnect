const express = require('express'); // Import express module //
const router = express.Router(); // Assigning express router method to router // 

// @route   GET api/posts //
// @desc    Test route //
// @access  Public //

router.get('/', (req, res) => res.send('Posts route')); 

module.exports = router;