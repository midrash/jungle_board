var express = require('express');
var router = express.Router();
const commentDTO = require('../dto/commentDTO');
const auth = require("../auth");

// 댓글 작성
router.post('/write', auth.checkAuth,async (req, res, next) => {
    try {
        let params = [
            req.body.postId,
            req.user.uuid,
            req.body.detail,
        ]
        let result = await commentDTO.writeComment(params);
        if (result != null){
            res.send(result);
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
