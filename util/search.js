
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

    this.index = 'science';
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


ElasticSearch.prototype.set_index = function(index) {
    this.index = index;
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
        // console.log(elem.url);
        bulk_body.push({
            index: {
                _index: index,
                _type: type,
                _id: elem.url
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


ElasticSearch.prototype.query_criteria = function(query_text) {
    
    return {
        size: 10,
        from: 0,
        query: {
            multi_match: {
                query: query_text,
                type: 'best_fields',
                fields: [
                    'title^3',
                    'abstract^2',
                    'introduction',
                    'results',
                    'discussion',
                    'methods',
                    'authors',
                    'references',
                    'subjects'
                ]
            }
        },
        highlight: {
            order: 'score',
            pre_tags: ['<snip>'],
            post_tags: ['</snip>'],
            fields: {
                abstract: {},
                discussion: {},
                introduction: {},
                results: {},
                methods: {},
                //'*': {}
            }
        }
    };

}


ElasticSearch.prototype.search = function(query_text) {

    var self = this;
    return new Promise(function(resolve, reject) {
        self.client.search({
            index: self.index,
            body: self.query_criteria(query_text)
        }).then(function(res) {
            if (res.hits.total > 0) {
                var data = res.hits.hits.map(function(x) {

                    return {
                        result: x._source,
                        snippet: x.highlight
                    };
                });
                resolve(data);
            } else {
                resolve([]);
            }
        }, function(err) {
            reject(err);
        }).catch(console.error);
    });

}


module.exports = ElasticSearch;

