const express = require('express'); // Import express module //
const router = express.Router(); // Assigning express router method to router // 
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');



// @route   POST api/posts 
// @desc    Create a post 
// @access  Private

router.post('/', [auth,
    check('text', 'Text is required').not().isEmpty()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {

            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });
            const post = await newPost.save();
            res.json(post);


        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


    });

// @route   GET api/posts 
// @desc    Get All posts 
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.send(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    Get Post by Id
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.json(post);

        if (!post) {
            return res.status(404).json({ msg: 'Post Not Found' });
        }

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post Not Found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   Delete api/posts/:id
// @desc    Delete a post 
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post Not Found' });
        }


        //check post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User Not Authorized' });
        }

        await post.remove();
        res.json({ msg: 'Post Removed' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post Not Found' });

        }
        res.status(500).send('Server Error');
    }
});

// @route   Put api/posts/like/:id
// @desc    Add a like to the post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check If Already Liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Already liked' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

// @route   Put api/posts/unlike/:id
// @desc    Remove a like of post 
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check If Already Liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has Not Been Liked' });
        }

        // Get RemoveIndex
        const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id));
        post.likes.splice(removeIndex, 1);


        await post.save();

        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});

// @route   POST api/posts/comment/:id
// @desc    Create a comment on post
// @access  Private

router.post('/comment/:id', [auth,
    check('text', 'Text is required').not().isEmpty()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        try {

            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);


        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


    });

// @route   Delete api/posts/comment/:id/:comment_id
// @desc    Delete a comment on post
// @access  Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        // Pull Out Comments 
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);

        // Make sure Comment Exists 
        if (!comment) {
            return res.status(404).json({ msg: 'Comment Does Not Exist' });
        };

        // Check User 
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not Authorized' });
        }

        // Get RemoveIndex
        const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id));
        post.comments.splice(removeIndex, 1);


        await post.save();

        res.json(post.comments);


    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});



module.exports = router;