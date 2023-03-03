const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userShema = new Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type : String,
        required : true,
        unique : true,
        trim: true
    },
    age:{
        type: Number,
        required: true
    },
    owner: {
        type : mongoose.Schema.Types.ObjectId,

    },
    password:{
        type:String,
        required : true,
        trim: true
    },
    tokens: [
       {
        token: {
            type: String,
        }
       }
    ]
});
// password encrution method
userShema.pre("save", async function (next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
}); //------------------------------------------

// login validation -------------
userShema.statics.findByCredentail = async (email,password) =>{
    const user = await User.findOne({email}); // check both email matching (model-email: this fun -email) = email
    if(!user){
        throw new Error(); // if not match email the throw error
    }
    // check password match or not 
    const isMatchPw = await bcrypt.compare(password, user.password); // compare with bycrypt ps
    if(!isMatchPw){
        throw new Error();
    }
    return user; 
}
//generate auth token
userShema.methods.generateAuthToken = async function (){
    const _user = this;
    const token = jwt.sign({_id:_user._id.toString()},process.env.TOKEN_KEY);
   _user.tokens = _user.tokens.concat({token});

   await _user.save(); // save to db
   return token;
}

const User = mongoose.model('User', userShema);
module.exports = User;