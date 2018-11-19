


function ElasticSearch() {
    
    this.fs = require('fs');
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

