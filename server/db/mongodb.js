const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.DATABASE_URI;
mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology:true
    
});
mongoose.connection.once('open', ()=> console.log('DB has been connected!'));