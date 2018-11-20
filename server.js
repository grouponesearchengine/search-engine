/*

    server entry point

*/

var app = require('./util/config.js')();
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});

