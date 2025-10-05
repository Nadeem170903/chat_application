const User = require('../models/User.modle');


const fetchAllUser = async(req,res)=>{
    const AllUser = await User.find().select('-password');
    console.log('there is all user registor users',AllUser)
    res.send(AllUser)
}


module.exports = {
    fetchAllUser,
}