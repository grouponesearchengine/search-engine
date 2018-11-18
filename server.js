/*

    server entry point

*/

var express = require('express');
var app = require('./util/config.js')(express);
var elastic = require('./util/search.js');


console.log(elastic);


app.get('/', function(req, res) {
    res.send('howdy dowdy!');
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});

