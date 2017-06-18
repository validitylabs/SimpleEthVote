var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send("Hello world!");
});
app.use('/UI', express.static('../UI'));

var port = 8080;
app.listen(port);
