



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


ElasticSearch.prototype.search = function(query_text) {

    var body = {
        size: 4,
        from: 0,
        query: {
            match: {
                abstract: {
                    query: query_text,
                    minimum_should_match: 3,
                    fuzziness: 2
                }
            }
        }
    };

    var self = this;
    return new Promise(function(resolve, reject) {
        self.client.search({
            index: 'library',
            body: body
        }).then(function(res) {
            if (res.hits.total > 0) {
                var output = res.hits.hits.map(x => x._source);
                resolve(output);
            } else {
                resolve([]);
            }
        }, function(err) {
            reject(err);
        }).catch(console.error);
    });

}


module.exports = ElasticSearch;

