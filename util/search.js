


/*

module.exports = function() {

    var elasticsearch = require('elasticsearch');
    var client = new elasticsearch.Client({
        hosts: ['http://localhost:9200']
    });


    //client.indices.exists({
    //    index: 'randomindex'
    //});


    client.ping({
        requestTimeout: 30000,
    }, function (err) {
        if (err) {
            console.error('elastic search is down');
        } else {
            console.log('all is well');
        }
    });

    //client.cluster.health({}, function(err, resp, status) {  
    //    console.log("-- Client Health --",resp);
    //});


    return client;

}

*/



function ElasticSearch() {

    this.elasticsearch = require('elasticsearch');
    this.client = new this.elasticsearch.Client({
        hosts: [
            'http://localhost:9200'
        ]
    });

}


ElasticSearch.prototype.ping = function() {
    this.client.ping({
        requestTimeout: 30000,
    }, function (err) {
        if (err) {
            console.error('elastic search is down');
        } else {
            console.log('All is well!');
        }
    });
}


module.exports = ElasticSearch;

