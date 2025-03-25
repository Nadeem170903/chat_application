const express = require('express');
const userController = require('../controller/user');
const router = express.Router();


router.post('/api/signUp',userController.signUp);
router.get('/api/checkAuth',userController.chekAuth);
router.post('/api/login',userController.signIn);

module.exports = router;