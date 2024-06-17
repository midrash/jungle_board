var express = require('express');
var router = express.Router();
const userDTO = require('../dto/userDTO');
const uath = require("../auth");

const bcrypt = require('bcrypt');
const saltRounds = 10; 

// 회원 조회
router.get('/',uath.checkAuth,async (req, res, next) =>{
    var users = await userDTO.getAllUser();
    if (users != null){
        res.send(users);
    }
});

// 로그인
router.post('/login', async (req, res, next) => {
    try {
        let params = [
            req.body.userId,
            // req.body.userPassword,
        ]
        var userInfo = await userDTO.login(params);
        if (userInfo.length > 0){
            bcrypt.compare(req.body.userPassword, userInfo[0].password, function(err, result) {
                if (err) {
                    res.status(500).send({ error: 'Internal Server Error', details: err.message });
                    return;
                }
                if (result) {
                    // console.log(result);
                    const token = uath.makeToken(userInfo); 
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict', // 이 옵션은 CSRF 공격을 방지하는 데 도움을 줍니다.
                        maxAge: 24 * 60 * 60 * 1000 // 쿠키의 만료 시간 (예: 24시간)
                    });
                    res.status(200).send("로그인 성공!");
                    return;
                } else {
                    res.status(200).send("아이디 혹은 비밀번호 오류");
                    return;
                }
            });
        }
        else{
            res.status(200).send("아이디 혹은 비밀번호 오류");
        }
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error', details: error.message });
        // next(err); // 필요한 경우, 오류를 다음 미들웨어로 전달할 수도 있습니다.
    }
    
});

// 회원가입
router.post('/signin', (req, res, next) => {
    try {
        bcrypt.hash(req.body.userPassword, saltRounds, async function(err, hash) {
            if (err) {
                return console.error('Error hashing password:', err);
            }
            console.log('Hashed password:', hash);
        // 이후 해시된 비밀번호를 데이터베이스에 저장하는 등의 작업을 수행합니다.
            let params = [
                req.body.userId,
                hash,
                //req.body.userPassword,
                req.body.userName,
            ];
            let result = await userDTO.signin(params);
    
            if (result != null) {
                res.status(200).send(result);
            } else {
                res.status(401).send({ error: 'Authentication failed' });
            }
        });
    } catch (err) {
        // 오류가 발생한 경우, 오류를 처리하고 클라이언트에게 적절한 응답을 보냅니다.
        res.status(500).send({ error: 'Internal Server Error', details: err.message });
        // next(err); // 필요한 경우, 오류를 다음 미들웨어로 전달할 수도 있습니다.
    }
});



module.exports = router;
