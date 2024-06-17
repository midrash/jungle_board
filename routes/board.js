var express = require('express');
var router = express.Router();
const boardDTO = require('../dto/boardDTO');
const commentDTO = require('../dto/commentDTO');
const uath = require("../auth");
/* GET board listing. */

// 게시글 목록 조회
router.get('/', async (req, res, next) =>{
    let board = await boardDTO.getPost();
    if (board != null){
        res.send(board);
    }
});

// 게시글 작성
router.post('/write',uath.checkAuth ,async (req, res, next) => {
    try {
        let params = [
            req.body.title,
            req.user.uuid,
            req.body.detail,
        ];
        // console.log(params);
        let result = await boardDTO.writePost(params);
        if (result != null) {
            let params_user_post=[
                req.user.uuid,
                result.insertId
            ]
            result = await boardDTO.writeUserPost(params_user_post);
            res.status(200).send(result);
        } else {
            res.status(401).send({ error: 'Authentication failed' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Internal Server Error', details: err.message });
    }
});

// 게시글 상세 조회
router.get('/detail', async (req, res, next)=> {
    try {
        let params = [
            req.query.postId
        ];
        let post = await boardDTO.getPostDetail(params);
        if (post.length > 0) {
            let comments = await commentDTO.getComment(post[0].id);
            post[0].comments = comments
            res.status(200).send(post);
        } else {
            res.status(401).send("해당 게시물 없음");
        }
    } catch (err) {
        res.status(500).send({ error: 'Internal Server Error', details: err.message });
    }
});



module.exports = router;
