
/*
    delete all indexes in elasticsearch:
    run elasticsearch in one terminal
    in another, run command:
        curl -X DELETE 'http://localhost:9200/_all'
*/


function ElasticSearch() {
    
    this.fs = require('fs');
    this.elasticsearch = require('elasticsearch');
    this.client = new this.elasticsearch.Client({
        hosts: [
            'http://localhost:9200'
        ]
    });

    this.min_match = 3;
    this.fuzziness = 2;

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


ElasticSearch.prototype.set_min_match = function(min_match) {
    this.min_match = min_match;
}


ElasticSearch.prototype.set_fuzziness = function(fuzziness) {
    this.fuzziness = fuzziness;
}


ElasticSearch.prototype.set_match_categories = function(categories) {
    
}


ElasticSearch.prototype.bulk_index_repo = async function(repo, index, type) {

    var self = this;
    this.fs.readdir(repo, function(err, files) {
        if (err) {
            console.log(err);
        } else {
            files.forEach(function(file) {
                var filepath = repo+file;
                self.bulk_index(filepath, index, type);
            });
        }
    });
    
}


ElasticSearch.prototype.bulk_index = async function(path, index, type) {
    
    var data_raw = await this.fs.readFileSync(path, 'utf-8');
    var data = JSON.parse(data_raw);
    console.log(data.length + ' items to be added to database');

    var bulk_body = [];
    data.forEach(elem => {
        bulk_body.push({
            index: {
                _index: index,
                _type: type
            }
        });
        bulk_body.push(elem);
    });

    var self = this;
    self.inserted = 0;
    this.client.bulk({body: bulk_body})
        .then(res => {
            res.items.forEach(item => {
                if (item.index && item.index.error) {
                    console.log(item.index.error);
                } else {
                    ++self.inserted;
                }
            });
            console.log('Indexed ' + 
                self.inserted + ' out of ' + 
                data.length + ' items');
            self.inserted = 0;
        })
        .catch(console.error);

}



ElasticSearch.prototype.get_query_criteria = function() {

    return {
        size: 10,
        from: 0,
        query: {
            match: {
                //abstract: {
                //    query: query_text,
                //    minimum_should_match: this.min_match,
                //    fuzziness: this.fuzziness
                //},
                abstract: {
                    query: query_text
                }
            }
        }
    };


}


ElasticSearch.prototype.search = function(query_text) {

    var body = {
        size: 10,
        from: 0,
        query: {
            match: {
                //abstract: {
                //    query: query_text,
                //    minimum_should_match: this.min_match,
                //    fuzziness: this.fuzziness
                //},
                abstract: {
                    query: query_text
                }
            }
        }
    };

    var self = this;
    return new Promise(function(resolve, reject) {
        self.client.search({
            index: 'science',
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

