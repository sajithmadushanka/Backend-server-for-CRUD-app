const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

const authz = async (req,res,next)=>{
    try {
        const  token = req.header("Authorization").replace("Bearer " ,"");
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
       // console.log(decoded);
        const user = await User.findOne({
            _id:decoded._id,
            'tokens.token':token
        })

        if(!user) throw new Error();
        req.user = user;
        req.token = token; // this for logout fun
        next();
    } catch (error) {
        res.status(401).send({error:"please Auth"});
    }
    
}

module.exports = authz;