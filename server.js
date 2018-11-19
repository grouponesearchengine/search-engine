/*

    server entry point

*/

var app = require('./util/config.js')();


var ElasticSearch = require('./util/search.js');
var elasticsearch = new ElasticSearch();
elasticsearch.ping();


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});

