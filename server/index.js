const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const userouter = require('./routes/user');
const taskrouter = require('./routes/task');


require("./db/mongodb");

// create express server
const app = express();
app.use(cors());
app.use(bodyparser.json());

// use router to express app
app.use(userouter);
app.use(taskrouter);


// port
const port = 4000;
app.listen(port,()=> console.log('Express Server is Running!', port));
