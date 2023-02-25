
const express = require('express');
const { fetchPosts, addPost } = require('../controllers/posts.controllers');
const authMiddleware = require('../middlewares/auth');

const postRouter = express.Router();

postRouter.get('/', async (req, res) => {

    try {
        let {page = 1, count = 10, search = ''} = req.query;

        page = parseInt(page);
        count = parseInt(count);

        const {posts, totalPosts} = await fetchPosts({
            page, count, search
        });

        return res.send({
            data: {
                records: posts,
                totalRecords: totalPosts,
            }
        })

    } catch(err) {
        console.error(err);

        return res.status(500).send({
            error: 'Something went wrong'
        })
    }
})

postRouter.post('/', authMiddleware, async (req, res) => {

    try {
        const {loggedInUser} = req; // guaranteed that user is logged in

        let {title, content} = req.body;

        const post = await addPost({
            title, content, 
            userId: loggedInUser._id
        });

        return res.send({
            data: post
        })


    } catch(err) {
        console.error(err);

        return res.status(500).send({
            error: 'Something went wrong'
        })
    }
})

module.exports = postRouter;