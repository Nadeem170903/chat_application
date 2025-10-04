const express = require('express');
const userController = require('../controller/auth.controller');
const router = express.Router();
const {checkAuth} = require('../middleware/auth.middleware')


router.post('/register',userController.register);
router.post('/login',userController.login);
router.post('/logout',userController.logOut);

module.exports = router;