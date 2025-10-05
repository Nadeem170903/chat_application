const express = require('express');
const router = express.Router();
const {fetchAllUser} = require('../controller/fetchAllUser.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.post('/allUser',authMiddleware.checkAuth, fetchAllUser);

module.exports = router;