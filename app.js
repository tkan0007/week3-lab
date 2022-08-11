let express = require("express");
let app = express();

let modRouter = require('./mod.js');
app.use('/',modRouter);

app.listen(8080);