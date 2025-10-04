const User = require('../models/User.modle');
const jwt = require('jsonwebtoken');




// module.exports.chekAuth = async (req,res)=>{
//     const token = req.headers.authorization?.split(' ')[1];

//     if (token) {
//         try {
//             const decodedToken = jwt.verify(token,jwtSecretKey);
//             const user = await User.findById(decodedToken.id).select('-password');

//             if (user) {
//                 res.json({ user });
//                 req.user = user;
//                 console.log('this is req user',req.user)
//             } else {
//                 res.status(401).json({ message: 'Unauthorized' });
//             }
//         } catch (err) {
//             console.error(err);
//             res.status(401).json({ message: 'Unauthorized' });
//         }
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// }

module.exports.register = async (req,res)=>{
    const {name , email, password} = req.body;

    // check user already exist or not 

    const isUserAlreadyExist = await User.findOne({email});

    if(isUserAlreadyExist){
        return res.status(401).json({
            message:'user already exist please create another email'
        })
    }

    // add user 

    const registorUser = await User.create({name,email,password});
    console.log('this is register user info', registorUser)
    
    const token = jwt.sign({token: registorUser._id}, process.env.JWTSECRETEKEY);
    res.cookie("token",token);
    res.status(200).json({
        messge:'user sign Up succesfull',
        user:{
            userId: registorUser._id,
            name:registorUser.name,
            email:registorUser.email
        }
    })


}

module.exports.login = async (req,res)=>{
    const {email, password} = req.body;
    console.log(`email = ${email} , password = ${password}`)

    const isUser = await User.findOne({email});
    // check user exist or not
    if(!isUser){
        return res.status(401).json({
            message:"User not exist at this emai"
        })
    }

    // check password correct or not
    const isPasswordCorrect = await isUser.comparePassword(password);

    if(!isPasswordCorrect){
        return res.status(401).json({
            message:"password not match"
        });
    };

    const token = jwt.sign({token: isUser._id},process.env.JWTSECRETEKEY);
    res.cookie("token",token);
    res.status(200).json({
        message:"user login successfully",
        user:{
            userID:isUser._id,
            name:isUser.name,
            email:isUser.email

        }
    })
}


module.exports.logOut = async (req,res)=>{
    res.clearCookie("token");
    res.status(200).json({
        message:"user logged out"
    })
}