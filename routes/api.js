

var express = require('express');
var router = express.Router();

var ElasticSearch = require('../util/search');
var elasticsearch = new ElasticSearch();
var articleSimilarity = null;

// uncomment to load data into repo
// elasticsearch.bulk_index_repo('repository/', 'science', 'articles');

router.get('/', function(req, res) {
    res.sendFile('index.html');
});


router.post('/search', function(req, res) {

    var query_text = req.body.text;
    elasticsearch.search(query_text)
        .then(function(data) {
            res.send(data);
        })
        .catch(console.error);
    
});


router.get('/similarity', function(req, res) {

    res.sendFile('/similarity.html', {
        root: __dirname + '/../public/views'
    });
});


router.post('/similarity', function(req, res) {

    var query_text = req.body.data;
    elasticsearch.similar(query_text)
        .then(function(data) {
            res.send(data);
        })
        .catch(console.error);

});


module.exports = router;

