const jwt = require('jsonwebtoken');
const User = require('../models/User.modle');


async function checkAuth(req,res,next){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"user not authorized please login first"
        });
    };

    try {
        const decode = jwt.verify(token,process.env.JWTSECRETEKEY);
        console.log('this is decode token',decode);
        const user = await User.findById(decode.token)
        req.currUser = user;
        next();
    } catch (error) {
        console.error("This error from authentication middleware",error.message)
    }
}

module.exports = {
    checkAuth
}