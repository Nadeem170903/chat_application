const User = require('../models/User');
const jwt = require('jsonwebtoken');
const jwtSecretKey = "djfakdj;fakdsjfauu243852"


const generateToken = (user)=>{
    const token = jwt.sign({id:user._id},jwtSecretKey,{expiresIn: '7d'});
    return token;
}



module.exports.chekAuth = async (req,res)=>{
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decodedToken = jwt.verify(token,jwtSecretKey);
            const user = await User.findById(decodedToken.id).select('-password');

            if (user) {
                res.json({ user });
                req.user = user;
                console.log('this is req user',req.user)
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        } catch (err) {
            console.error(err);
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports.signUp = async (req,res)=>{
    console.log('request comes properly')
    try{
        const {name,email,password} = req.body;
        const user = new User({name,email,password});
        await user.save();
        const token = generateToken(user);
        res.status(201).json({token,user})
        console.log(user);
    } catch(e){
        console.log(e);
    }
}

module.exports.signIn = async (req,res)=>{
    console.log("request come properly")
    try{
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).send('Invalid email or password');
        if(user && user.comparePassword(password)){
            const token = generateToken(user);
            console.log(token, "this is toeken")
            res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.status(200).json({token,user})

        }
       
        } catch(e){
            console.log(e);
        }

}