

var express = require('express');
var router = express.Router();

var ElasticSearch = require('../util/search');
var elasticsearch = new ElasticSearch();

// uncomment to load data into repo
// elasticsearch.bulk_index_repo('repository/', 'science', 'articles');

router.get('/', function(req, res) {
    res.sendFile('index.html');
});


router.post('/search', function(req, res) {

    var query = req.body.text;
    var from = req.body.from;
    var size = req.body.size;

    elasticsearch.search(query, from, size)
        .then(function(data) {
            res.send(data);
        })
        .catch(console.error);
    
});


router.get('/advanced', function(req, res) {
    res.sendFile('/advanced.html', {
        root:__dirname + '/../public/views'
    });
});


router.post('/advanced', function(req, res) {

    var query = req.body;
    elasticsearch.advanced(query)
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
    var from = req.body.from;
    var size = req.body.size;
    elasticsearch.similar(query_text, from, size)
        .then(function(data) {
            res.send(data);
        })
        .catch(console.error);

});


module.exports = router;

