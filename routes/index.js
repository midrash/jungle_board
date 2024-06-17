var express = require('express');
var router = express.Router();
const auth = require("../auth")

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send('자꾸 쓸모없는 이미지가 만들어져요3');
});
router.get('/test', function(req, res, next) {
  // res.render('index', { title: 'Express' });
    console.log("토큰: "+ req.cookies.token);
    auth.checkAuth(req.cookies.token,res);
    res.send(req.cookies.token);
});

module.exports = router;
