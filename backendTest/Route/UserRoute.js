var express= require('express');
var router = express.Router();
var userController = require('../Controller/UserController')

router.post('/create-user',userController.createUser);

router.get('/list-user',userController.listUser);


router.post('/login',userController.loginUser)



module.exports = router;